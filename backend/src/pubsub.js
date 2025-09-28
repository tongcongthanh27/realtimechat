// pubsub.js
import { EventEmitter } from "events";

export const ee = new EventEmitter();

export const pubsub = {
  publish: (event, payload) => ee.emit(event, payload),

  asyncIterator(event) {
    const queue = [];
    let push;
    const pull = () => new Promise((resolve) => (push = resolve));

    const handler = (payload) => {
      if (push) {
        push({ value: payload, done: false });
        push = null;
      } else {
        queue.push(payload);
      }
    };

    ee.on(event, handler);

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        if (queue.length) {
          return Promise.resolve({ value: queue.shift(), done: false });
        }
        return pull();
      },
      return() {
        ee.off(event, handler); // remove only this handler
        return Promise.resolve({ done: true });
      },
    };
  },
};
