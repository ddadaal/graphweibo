import { Box, Button, TextArea } from "grommet";
import Router from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "simstate";
import { LocalizedString, useLocalized } from "simstate-i18n";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";
import { useHttpRequest } from "src/utils/http";

const root = lang.components.weiboInput;

interface Props {
  onSubmitCompleted?: () => void;
}

const api = getApi(weiboApi);

export const WeiboInput: React.FC<Props> = (props) => {

  const userStore = useStore(UserStore);
  const loggedIn = userStore.loggedIn;

  const [sending, setSending] = useState(false);
  const request = useHttpRequest(setSending);
  const [text, setText] = useState("");

  const toLogin = () => {
    Router.push("/login");
  };

  const onSend = () => request(async () => {
    await api.send({ body: { content: text } });
    toast.success(<LocalizedString id={root.submitSuccess} />);
    props.onSubmitCompleted?.();
  });

  return (
    <Box gap="small">
      <TextArea
        placeholder={
          useLocalized(loggedIn ? root.placeholder: root.textAreaLoginPrompt) as string}
        value={text}
        disabled={!loggedIn || sending}
        onChange={(e) => setText(e.target.value)}
      />
      <Button primary label={
        <LocalizedString id={
          loggedIn
            ? sending ? root.submitting : root.submit
            : root.buttonLoginPrompt
        }
        />
      } onClick={loggedIn ? onSend : toLogin} disabled={sending}
      />
    </Box>
  );
};
