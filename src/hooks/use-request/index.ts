import { ref } from '@vue/composition-api';
import { Options } from './type';
import { isOnCurPage } from './utils';
// import { debounce, throttle } from 'lodash-es'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

export default function useRequest<T extends unknown[], U>(
  requestFn: (...params: T) => Promise<U>,
  options?: Options,
) {
  const requestData = ref<U>();
  const loading = ref(false);
  async function startRequest(...params: T) {
    loading.value = true;
    const res = await requestFn(...params);
    requestData.value = res;
    loading.value = false;
    return res;
  }

  function RequestInPolling(time = 1000) {
    let timer = null as any;
    const run = async (...params: T) => {
      const data = await startRequest(...params);
      options?.onSuccess && options.onSuccess(data, null);
      timer = setInterval(async () => {
        if (!options?.pollingWhenHidden || isOnCurPage()) {
          const data = await startRequest(...params);
          options?.onSuccess && options.onSuccess(data, null);
        }
      }, time);
      return data;
    };
    const cancel = () => {
      if (!timer) {
        throw ReferenceError(`can't stop before running`);
      }
      loading.value = false;
      clearInterval(timer);
    };
    return {
      run,
      cancel,
    };
  }
  const requestInPolling = RequestInPolling(options?.pollingInterval || 1000);

  async function run(...params: T): Promise<U> {
    if (options?.pollingInterval) {
      return requestInPolling.run(...params);
    }
    const data = await startRequest(...params);
    console.log('res111111111111',data)
    options && options.onSuccess && options.onSuccess(data, null);
    return data;
  }

  function runFactory() {
    if (options?.debounceInterval) {
      return debounce(run, options.debounceInterval);
    }
    if (options?.throttleInterval) {
      return throttle(run, options.throttleInterval);
    }
    return run;
  }

  
  if (!options?.manaul) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    run();
    console.log('options?.manaul',options?.manaul)
  }

  return {
    data: requestData,
    loading,
    run: runFactory(),
    cancel: requestInPolling.cancel,
  };
}
