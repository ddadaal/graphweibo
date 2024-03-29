import React, { useState } from "react";
import {
  Box, FormField,
  TextInput, Button, CheckBox, Heading,
} from "grommet";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { useRouter } from "next/router";
import { useHttpRequest } from "src/utils/http";
import { AnchorLink } from "src/components/AnchorLink";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { queryToString } from "src/utils/querystring";

const root = lang.pages.home.login;

const defaultValue = { username: "", password: "", remember: true };

const api = getApi(authApis);

const LoginForm: React.FC = () => {
  const router = useRouter();

  const pathname = queryToString(router.query.pathname);
  const asPath = queryToString(router.query.asPath);

  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const jumpBackOrDefault = async (defaultPath: string) => {
    if (pathname) {
      await router.push(pathname, asPath);
    } else {
      await router.push(defaultPath);
    }
  };

  const login = () => request(async () => {
    const { username, password, remember } = value;
    try {
      const res = await api.login({ query: { username, password } });

      userStore.login({
        userId: res.userId,
        username,
        token: res.token,
        remember: remember,
      });
      await jumpBackOrDefault("/");
    } catch (e) {
      console.log(e);
      if (e.status === 401) {
        toast.error(
          <LocalizedString id={root.error.badCredentials} />
        );
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={login} validate="blur">
      <FormField
        label={<LocalizedString id={root.username} />}
        name="username" required={true}
        disabled={inProgress}
      >
        <TextInput name="username"/>
      </FormField>
      <FormField
        label={<LocalizedString id={root.password} />} name="password" required={true}
        disabled={inProgress}
      >
        <TextInput type="password" name="password"/>
      </FormField>
      <Box margin={{ vertical: "small" }}>
        <CheckBox
          name="remember" label={<LocalizedString id={root.remember} />}
        />
      </Box>
      <Box>
        <Button
          type="submit"
          label={<LocalizedString id={inProgress ? root.inProgress : root.login} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
      <Box direction="row" justify="center" margin={{ top: "small" }}>
        <AnchorLink href="/register">
          <LocalizedString id={root.toRegister} />
        </AnchorLink>
      </Box>
    </Form>
  );
};

export const LoginPage: React.FC = () => {
  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.login} />
        </Heading>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
