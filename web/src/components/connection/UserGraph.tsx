import React, { useMemo } from "react";
import { range } from "src/utils/array";
import Graph from "vis-react";

const colors = {
  "intermediate": "#75c2f8",
  "from": "#ff7f0e",
  "to": "#ff7f0e",
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
  const { fromUser, toUser, intermediateUsers, paths } = props;

  const data = useMemo(() => {
    const edges = [] as Record<string, string>[];

    paths.forEach((path) => {
      range(0, path.length-1).forEach((i) => {
        edges.push({
          from: path[i],
          to: path[i+1],
        });
      });
    });

    const nodes =[
      { id: fromUser.userId, label: fromUser.username, color: colors.from },
      { id: toUser.userId, label: toUser.username, color: colors.to },
      ...intermediateUsers.map(({ userId: id, username }) =>
        ({ id, label: username, color: colors.intermediate })),
    ];

    return { edges, nodes };
  }, [fromUser, toUser, intermediateUsers, paths]);

  return (
    <Graph
      graph={data}
      style={{ height: "500px" }}
    />
  );
};
