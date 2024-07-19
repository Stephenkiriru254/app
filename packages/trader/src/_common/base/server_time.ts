import { TCoreStores } from '@deriv/stores/types';
import moment from 'moment';

export const PromiseUtils = {
    createPromise<T>() {
        let resolve: (value: T | PromiseLike<T>) => void;
        let reject: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });

        return {
            promise,
            resolve: resolve!, // Non-null assertion to tell TypeScript that resolve will be defined
            reject: reject!, // Non-null assertion to tell TypeScript that reject will be defined
        };
    },
};

const ServerTime = (() => {
    let clock_started = false;
    const pending = PromiseUtils.createPromise<moment.Moment>();
    let common_store: TCoreStores['common'];

    const init = (store: TCoreStores['common']) => {
        if (!clock_started) {
            common_store = store;
            pending.resolve(common_store.server_time);
            clock_started = true;
        }
    };

    const get = () => (clock_started && common_store.server_time ? common_store.server_time.clone() : undefined);

    return {
        init,
        get,
        timePromise: () => (clock_started ? Promise.resolve(common_store.server_time) : pending.promise),
    };
})();

export default ServerTime;