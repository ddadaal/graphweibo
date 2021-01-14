import React, { useMemo } from "react";
import { range } from "src/utils/array";
import Graph from "react-sigma-graph";

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

  const { fromUser, toUser, intermediateUsers, paths } = props;

  const edges = [] as Record<string, string>[];

  paths.forEach((path) => {
    range(0, path.length-1).forEach((i) => {
      edges.push({
        source: path[i],
        target: path[i+1],
        label: "关注",
        type: "arrow",
      });
    });
  });

  const _data = {
    nodes: [
      { id: fromUser.userId, name: fromUser.username,category: "from" },
      { id: toUser.userId, name: toUser.username,category: "to" },
      ...intermediateUsers.map(({ userId: id, username }) =>
        ({ id, name: username, category: "intermediate"  })),
    ],
    edges,
  };
  const categoryColors = {
    "intermediate": "#1f77b4",
    "from": "#ff7f0e",
    "to": "#ff7f0e",
  };
  return (
    <Graph data={_data} categoryColors={categoryColors} />
  );

};
