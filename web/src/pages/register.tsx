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
import Router from "next/router";
import { useHttpRequest } from "src/utils/http";
import { AnchorLink } from "src/components/AnchorLink";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";

const root = lang.pages.home.register;

const defaultValue = { username: "", password: "", remember: true };

const api = getApi(authApis);

const RegisterForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const register = () => request(async () => {
    const { username, password, remember } = value;
    try {
      const res = await api.register({ body: { username, password } });
      toast.success(
        <LocalizedString id={root.success} />
      );
      await Router.push("/");
      userStore.login({
        username,
        userId: res.userId,
        token: res.token,
        remember: remember,
      });
    } catch (e) {
      if (e.status === 409) {
        toast.error(
          <LocalizedString id={root.error.conflict} />
        );
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={register} validate="blur">
      <FormField
        label={<LocalizedString id={root.username} />}
        name="username"
        required={true}
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
          disabled={inProgress}
          name="remember"
          label={<LocalizedString id={root.remember} />}
        />
      </Box>
      <Box>
        <Button
          type="submit"
          label={<LocalizedString id={inProgress ? root.inProgress : root.register} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
      <Box direction="row" justify="center" margin={{ top: "small" }}>
        <AnchorLink href="/login">
          <LocalizedString id={root.toLogin} />
        </AnchorLink>
      </Box>
    </Form>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small"  >
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.title} />
        </Heading>
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default RegisterPage;
