import { UserResult } from "graphweibo-api/user/search";
import { Box, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
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

  const onInput = async (e) => {
    const newValue = e.target.value;
    setText(newValue);
    props.onSelected(null);
    try {
      const searchResult = await api.search({ query: { query: newValue } });
      setSuggestions(searchResult.results);
    } catch (e) {
      // ignored
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

  return (
    <TextInput
      value={text}
      placeholder={initialLoading
        ? useLocalized(root.gettingInfoForInitialId, [props.initialId])
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
