import { Box, Button, TextArea } from "grommet";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { LocalizedString, useLocalized } from "simstate-i18n";
import { getApi } from "src/apis";
import { weiboApi } from "src/apis/weibo";
import { lang } from "src/i18n";
import { useHttpRequest } from "src/utils/http";

const root = lang.components.weiboInput;

interface Props {
  onSubmitCompleted?: () => void;
}

const api = getApi(weiboApi);

export const WeiboInput: React.FC<Props> = (props) => {
  const [sending, setSending] = useState(false);
  const request = useHttpRequest(setSending);
  const [text, setText] = useState("");

  const onSend = () => request(async () => {
    await api.send({ body: { content: text } });
    toast.success(<LocalizedString id={root.submitSuccess} />);
    props.onSubmitCompleted?.();
  });

  return (
    <Box gap="small">
      <TextArea
        placeholder={useLocalized(root.placeholder) as string}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button primary label={
        <LocalizedString id={
          sending ? root.submitting : root.submit
        }
        />
      } onClick={onSend}
      />
    </Box>
  );
};
