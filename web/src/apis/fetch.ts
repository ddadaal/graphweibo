import { Endpoint, replacePathArgs, Schema } from "graphweibo-api";
import { isFormData } from "src/utils/isServer";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { failEvent, finallyEvent, prefetchEvent, successEvent } from "./events";
import { config } from "src/utils/config";

const baseUrl = config.apiRoot;

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

let token = "";

export function changeToken(newToken: string): void {
  token = newToken;
}

export type Querystring =Record<string, string | string[] | number | undefined>;

export function fullFetch(
  path: string,
  query?: Querystring,
  init?: RequestInit
): Promise<Response> {
  const headers = token
    ? { ...init?.headers, "authorization": `Bearer ${token}` }
    : init?.headers ?? {};

  let url = baseUrl + path;
  if (query) {
    url += "?";
    // TODO use a better URLSearchParam strategy
    url += new URLSearchParams(query as any).toString();
  }

  return fetch(url,
    {
      ...init,
      headers,
      mode: "cors",
      // disable cache for IE11
      cache: "no-cache",
    });

}

export type FullFetch = typeof fullFetch;

export interface FetchInfo {
  path: string;
  method?: HttpMethod;
  query?: Querystring;
  body?: unknown;
  headers?: Record<string, string>;
}

export type JsonFetchResult<TResp> = TResp;

export type HttpError<T = object> = {
  data: T;
  status: number;
}

export function makeHttpError<T>(data: T, status: number) {
  return { data, status };
}

/**
 * Fetch and returns as json.
 * @param info the fetch info
 * @throws {JsonFetchError} If the statusCode is not [200, 300), a error will be thrown
 */
export async function jsonFetch<T>(
  info: FetchInfo,
): Promise<JsonFetchResult<T>> {

  const isForm = isFormData(info.body);

  prefetchEvent.execute(undefined);

  try {
    const resp = await fullFetch(info.path, info.query, {
      method: info.method ?? "GET",
      headers: {
        ...isForm ? undefined : { "content-type": "application/json" },
        ...info.headers,
      },
      body: isForm ? (info.body as any) : JSON.stringify(info.body),
    });

    const body = await resp.text();
    const obj = body ? JSON.parse(body) : {};

    if (resp.ok) {
      successEvent.execute({ status: resp.status, data: obj });
      return obj;
    } else {
      const payload = { status: resp.status, data: obj };
      failEvent.execute(payload);
      throw payload;
    }
  } catch (r) {
    // existence of r.type indicates it's a server error (node-fetch)
    if (r.name === "FetchError") {
      const payload = { status: -2, data: JSON.parse(JSON.stringify(r)) };
      failEvent.execute(payload);
      throw payload;
    }
    // TypeError is client side fetch error
    if (r instanceof TypeError) {
      const payload = { status: -1, data: r };
      failEvent.execute(payload);
      throw payload;
    }
    throw r;
  } finally {
    finallyEvent.execute(undefined);
  }

}

export type JsonFetch = typeof jsonFetch;

type Responses<T extends Schema> = T["responses"];

type SuccessResponse<T extends Schema> =
  Responses<T>[200] extends object
  ? Responses<T>[200]
  : Responses<T>[201] extends object ? Responses<T>[201] : never;

type SelectNotUndefined<T extends {
  path: {} | undefined;
  query: {} | undefined;
  body: {} | undefined}> =
  ({ path: T["path"] } extends { path: object } ?  { path: T["path"]} : {}) &
  ({ query: T["query"] } extends { query: object } ? { query: T["query"]} : {}) &
  ({ body: T["body"] } extends { body: object } ? { body: T["body"]} : {});


export function fromApi<TSchema extends Schema>(endpoint: Endpoint) {
  return function (
    args: SelectNotUndefined<{
      path: TSchema["path"];
      query: TSchema["querystring"];
      body: TSchema["body"];
    }>,
  ): Promise<JsonFetchResult<SuccessResponse<TSchema>>>  {

    const anyArgs = args as any;
    // replace path params
    const replacedPath = anyArgs.path
      ? replacePathArgs(endpoint.url, anyArgs.path)
      : endpoint.url;

    return jsonFetch({
      path: replacedPath,
      method: endpoint.method,
      query: removeNullOrUndefinedKey(anyArgs.query),
      body: anyArgs.body,
    });
  };
}
