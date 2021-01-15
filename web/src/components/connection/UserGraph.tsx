import React, { useMemo } from "react";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { range } from "src/utils/array";
import { DataSet } from "vis-data";
import { VisGraph } from "./VisGraph";

const colors = {
  "intermediate": "#75c2f8",
  "from": "#ff7f0e",
  "to": "#ff7f0e",
  "white": "#ffffff",
  "black": "#000000",

};

interface User {
  userId: string;
  username: string;
}

interface Props {
  fromUser: User;
  toUser: User;
  intermediateUsers: User[];
  // id of users
  paths: string[][];
}

export const UserGraph: React.FC<Props> = (props) => {

  const themeStore = useStore(ThemeStore);


  const { fromUser, toUser, intermediateUsers, paths } = props;

  // redraw graph when body resized

  const data = useMemo(() => {
    const edges = [] as Record<string, string>[];

    paths.forEach((path) => {
      range(0, path.length-1).forEach((i) => {
        edges.push({
          from: path[i],
          to: path[i+1],
          color: themeStore.theme === "dark" ? colors.white : colors.black,
        });
      });
    });

    const nodes =[
      { id: fromUser.userId, label: fromUser.username, color: colors.from },
      { id: toUser.userId, label: toUser.username, color: colors.to },
      ...intermediateUsers.map(({ userId: id, username }) =>
        ({ id, label: username, color: colors.intermediate })),
    ];

    return { edges: new DataSet(edges), nodes: new DataSet(nodes) };
  }, [fromUser, toUser, intermediateUsers, paths, themeStore.theme]);

  return (
    <VisGraph
      data={data}
      style={{ height: "500px" }}
    />
  );
};
