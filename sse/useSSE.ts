import { useContext, useReducer, useEffect } from 'react';
import { SSEContext, Listener, Event } from './sse-context';

type Action<T> = { event: Event; data: T };
type StateReducer<S, T> = (state: S, changes: Action<T>) => S;
type Parser<T> = (data: any) => T;

export type Options<S, T = S> = {
  stateReducer?: StateReducer<S, T>;
  parser?: Parser<T>;
  context?: typeof SSEContext;
};

export function useSSE<S, T = S>(
  eventName: string,
  callback: (event: MessageEvent) => void,
  options?: Options<S, T>
): S {
  const {
    stateReducer = (_: S, action: Action<any>) => action.data,
    parser = (data: any) => JSON.parse(data),
    context = SSEContext,
  } = options || {};

  const source = useContext(context);
  const [state, dispatch] = useReducer<StateReducer<S, T>>(
    stateReducer,
    null
  );

  if (!source) {
    throw new Error(
      'Could not find an SSE context; You have to wrap useSSE() in a <SSEProvider>.'
    );
  }

  useEffect(() => {
    const listener: Listener = (event: MessageEvent) => {
      const data = parser(event.data);
      callback(event);

      dispatch({
        event,
        data,
      });
    };

    // TODO: On the client-side, run a timer with setTimeout() set to 20 seconds.
    // Each time you receive any data from the server (whether genuine data, or your keep-alive),
    // kill the timer, and start it again. Therefore the only time the time-out function will get called is if your server went more than 20 seconds without sending you anything.
    // When that happens, kill the connection and reconnect.
    // console.log('IN USE SSE');

    source && source.addEventListener(eventName, listener);

    return () => {
      source && source.removeEventListener(eventName, listener);
    };
  }, []);

  return state;
}
