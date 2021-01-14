import React, { useEffect, useRef, CSSProperties } from "react";
import { Data, Network, NetworkEvents, Options } from "vis-network/peer/esm/vis-network";

import "vis-network/styles/vis-network.css";

const defaultOptions: Options = {
  physics: { stabilization: false },
  autoResize: true,
  edges: {
    smooth: false,
    color: "#000000",
    width: 0.5,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
  },
};

interface Props {
  data: Data;
  options?: Options;
  events?: Record<NetworkEvents, (p: any) => void>;
  style?: CSSProperties;
}

export const VisGraph: React.FC<Props> = ({
  data,
  options = defaultOptions,
  events = {},
  style = { width: "100%", height: "100%" },
}) => {
  const network = useRef<Network | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    network.current = new Network(
      container.current!,
      data,
      options
    );
  }, []);

  useEffect(() => {
    network.current!.setOptions(options);
  }, [options]);

  useEffect(() => {
    for (const eventName of Object.keys(events)) {
      network.current!.on(eventName, events[eventName]);
    }

    return () => {
      for (const eventName of Object.keys(events)) {
        network.current!.off(eventName, events[eventName]);
      }
    };
  }, [events]);

  return <div ref={container} style={style} />;
};
