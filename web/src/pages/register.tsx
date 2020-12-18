import { Input, Checkbox, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useStore } from "simstate";
import { LocalizedString, useLocalized } from "simstate-i18n";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { FormButton, HomePageLayout } from "src/pageComponents/Home/HomePageLayout";
import { PageIndicator } from "src/pageComponents/Home/PageIndicator";
import { UserStore } from "src/stores/UserStore";
import { useHttpRequest } from "src/utils/http";
import { useNotification } from "src/utils/NotificationHelper";
import { PageMetadata } from "src/utils/PageMetadata";
import { required } from "src/utils/validateMessages";

const root = lang.pages.home.register;

const RegisterForm: React.FC = () => {

  const userStore = useStore(UserStore);

  const api = useNotification();

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const onFinish = (values: { [key: string]: any }) => request(async () => {
    const { username, password, remember } = values;
    try {
      const api = getApi(authApis);
      const resp = await api.login({ query: { username, password } });

      userStore.login({
        userId: resp.userId,
        username,
        token: resp.token,
        remember,
      });
    } catch (e) {
      if ((e as HttpError).status === 401) {
        api.error({
          message: <LocalizedString id={root.error.title} />,
          description: <LocalizedString id={root.error.badCredentials} />,
        });
      } else {
        throw e;
      }
    }
  });

  const username = useLocalized(root.username) as string;
  const password = useLocalized(root.password) as string;

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <PageMetadata titleId={root.title} />
      <Form.Item
        name="username"
        rules={[{ required: true, message: required }]}
      >
        <Input
          disabled={loading}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={username}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: required }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          disabled={loading}
          placeholder={password}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox disabled={loading}><LocalizedString id={root.remember} /></Checkbox>
        </Form.Item>
      </Form.Item>
      <Form.Item>
        <FormButton loading={loading} type="primary" htmlType="submit">
          <LocalizedString id={root.register} />
        </FormButton>
      </Form.Item>
    </Form >
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <HomePageLayout title={<PageIndicator value="register" />}>
      <RegisterForm />
    </HomePageLayout>
  );
};

export default RegisterPage;
