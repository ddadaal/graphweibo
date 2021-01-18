import { useCallback, useState } from "react";

type Callback = () => void;

export function ScrollEventStore() {
  const [events, setEvents] = useState([] as Callback[]);

  const register = useCallback((callback: Callback) => {
    setEvents((e) => [...e, callback]);
  }, [setEvents]);

  const unregister = useCallback((callback: Callback) => {
    setEvents((e) => e.filter((x) => x !== callback));
  }, [setEvents]);

  return {
    events,
    register,
    unregister,
  };
}
