// pubsub.js
import { EventEmitter } from "events";

const ee = new EventEmitter();

export const pubsub = {
  publish: (event, payload) => ee.emit(event, payload),
  asyncIterator: (event) => ({
    [Symbol.asyncIterator]: () => {
      const queue = [];
      const handler = (payload) => queue.push(payload);
      ee.on(event, handler);
      return {
        next() {
          return new Promise((resolve) => {
            if (queue.length > 0) {
              resolve({ value: queue.shift(), done: false });
            } else {
              const listener = (payload) => {
                ee.off(event, listener);
                resolve({ value: payload, done: false });
              };
              ee.on(event, listener);
            }
          });
        },
        return() {
          ee.removeAllListeners(event);
          return Promise.resolve({ done: true });
        },
      };
    },
  }),
};
