import React from "react";
import { Radio } from "antd";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import Router from "next/router";

const root = lang.pages.home.pageIndicator;

interface Props {
  value: "login" | "register";
}

export const PageIndicator: React.FC<Props> = ({ value }) => {

  return (
    <Radio.Group value={value}>
      <Radio.Button onClick={() => Router.push("/")} value="login">
        <LocalizedString id={root.login} />
      </Radio.Button>
      <Radio.Button onClick={() => Router.push("/register")} value="register">
        <LocalizedString id={root.register} />
      </Radio.Button>
    </Radio.Group>
  );
};
