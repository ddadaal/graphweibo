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

interface Props {
  fromId: string;
  toId: string;
  usernames: Record<string, string>;
  // id of users
  paths: string[][];
}

export const UserGraph: React.FC<Props> = (props) => {

  const themeStore = useStore(ThemeStore);


  const { fromId, toId, usernames, paths } = props;

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

    const nodes = Object.entries(usernames).map(([userId, username]) => ({
      id: userId,
      label: username,
      color: userId == fromId ? colors.from
        : userId == toId ? colors.to :colors.intermediate,
    }));

    return { edges: new DataSet(edges), nodes: new DataSet(nodes) };
  }, [usernames, paths, themeStore.theme]);

  return (
    <VisGraph
      data={data}
      style={{ height: "500px" }}
    />
  );
};
