import { Tab, Tabs, Text  } from "grommet";
import Router from "next/router";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

interface Props {
  weiboCount: number;
  followingsCount: number;
  followersCount: number;
  userId: string;
}

const root = lang.pages.profile.contentSelector;

const tabs = ["weibo", "followings", "followers"];

interface Props {
  tab: "weibo" | "followings" | "followers";
}

const TabTitle: React.FC<{
  textId: string;
  count: number
}> = ({ textId, count }) => (
  <Text>
    <LocalizedString id={textId} />
    ({count})
  </Text>
);

export const ContentSelector: React.FC<Props> = (props) => {

  return (
    <Tabs
      activeIndex={tabs.indexOf(props.tab)}
      onActive={(i) => Router.push(`/profile/${props.userId}/${i == 0 ? "" : tabs[i]}`)}
    >
      <Tab title={<TabTitle textId={root.weibo} count={props.weiboCount} />} />
      <Tab title={<TabTitle textId={root.followings} count={props.followingsCount} />} />
      <Tab title={<TabTitle textId={root.followers} count={props.followersCount} />} />
    </Tabs>
  );
};
