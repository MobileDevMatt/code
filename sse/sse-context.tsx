import { FC, createElement, createContext, useState } from 'react';
import { SourceManager, createSourceManager } from './createSourceManager';
import RNEventSource from 'rn-eventsource';


export interface Event {
  data: any;
}

export interface Listener {
  (event: Event): void;
}

export interface Source {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
  close(): void;
}

export const SSEContext = createContext<SourceManager | null>(null);

export const SSEConsumer = SSEContext.Consumer;

type WithSource = { source: () => Source };
type WithEndpoint = { endpoint: string };
type Props = WithSource | WithEndpoint;

const isPropsWithSource = (_: WithSource | WithEndpoint): _ is WithSource =>
  'source' in _;

const createDefaultSource = (endpoint: string) => (): Source =>
  new RNEventSource(endpoint);

export const SSEProvider: FC<Props> = ({ children, ...props }) => {
  const [source] = useState(() =>
    createSourceManager(
      !isPropsWithSource(props)
        ? createDefaultSource(props.endpoint)
        : props.source
    )
  );

  return createElement(
    SSEContext.Provider,
    { value: source },
    children
  );
};
