import { UserResult } from "graphweibo-api/user/search";
import { TextInput } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { useLocalized } from "simstate-i18n";
import { getApi } from "src/apis";
import { userApi } from "src/apis/user";
import { lang } from "src/i18n";
import { UserInfo } from "src/models/UserInfo";

const root = lang.components.userSelectTextBox;

interface Props {
  initialId?: string;
  onSelected: (selected: UserInfo | null) => void;
}

const api = getApi(userApi);

function label({ userId, username }: UserResult) {
  return `${username} (${userId})`;
}

export const UserSelectTextBox: React.FC<Props> = (props) => {

  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([] as UserResult[]);
  const [initialLoading, setInitialLoading] = useState(false);

  const select = (userResult: UserResult) => {
    setText(label(userResult));
    props.onSelected(userResult);
  };

  // only triggers search user when last search has completed
  // due to limitation of backend
  const lastRequestCompleted = useRef(true);

  const onInput = async (e) => {
    const newValue = e.target.value as string;
    setText(newValue);
    props.onSelected(null);
    if (lastRequestCompleted.current) {
      lastRequestCompleted.current = false;
      try {
        const searchResult = await api.search({ query: { query: newValue.trim() } });
        setSuggestions(searchResult.results);
      } catch (e) {
      // ignored
      } finally {
        lastRequestCompleted.current = true;
      }
    }
  };

  useEffect(() => {
    if (props.initialId) {
      setInitialLoading(true);
      api.search({ query: { userId: props.initialId } })
        .then((r) => {
          if (r.results.length === 1) {
            const result = r.results[0];
            select(result);
          }
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [props.initialId]);

  const onSuggestionSelect = ({ suggestion }: { suggestion: { value: UserResult}}) => {
    select(suggestion.value);
  };

  const placeholder = useLocalized(root.gettingInfoForInitialId, [props.initialId]);

  return (
    <TextInput
      value={text}
      placeholder={initialLoading
        ? placeholder
        : ""}
      disabled={initialLoading}
      onChange={onInput}
      suggestions={suggestions.map((x) => ({
        label: label(x),
        value: x,
      }))}
      onSelect={onSuggestionSelect}
    />
  );
};
