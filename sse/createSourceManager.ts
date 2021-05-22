import { Source, Listener } from './sse-context';

type State = {
  source: Source | null;
  listenersByName: Map<string, Set<Listener>>;
};

export type SourceManager = {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
};

export const createSourceManager = (
  createSource: () => Source
): SourceManager => {
  const state: State = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    addEventListener(name, listener) {
      // console.log('ADD EVENT LISTENER')
      if (!state.listenersByName.size) {
        state.source = createSource();
      }

      if (!state.source) {
        // throw new Error("The source doesn't exist");
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.add(listener);

      state.listenersByName.set(name, listeners);

      state.source.addEventListener(name, listener);
    },

    removeEventListener(name, listener) {
      // console.log('REMOVE EVENT LISTENER')

      if (!state.source) {
        // throw new Error("The source doesn't exist");
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.delete(listener);

      if (!listeners.size) {
        state.listenersByName.delete(name);
      }

      state.source.removeEventListener(name, listener);

      if (!state.listenersByName.size) {
        state.source.close();
        state.source = null;
      }
    },
  };
};
