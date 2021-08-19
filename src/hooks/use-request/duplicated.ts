import { Ref, ref } from '@vue/composition-api';
import { Options, Params, Request } from './type';
import { isOnCurPage } from './utils';


// 这个应该是个单例，否则连续执行run会出问题
function setFunctionInterval<T extends unknown[],U>(request: (...arr: T) => Promise<U>,time = 1000) {
    let timer: NodeJS.Timer;
    let result:U
    return {
        async start(...params: T) {
            // timer为单例，否则在手动请求的情况下会执行好多个定时器
            if(timer) {
                return result
            }
            timer = setInterval(async () => {
                result = await request(...params)
            }, time);
            return result
        },
        stop() {
            clearInterval(timer)
        }
    }
}

function requestFactor<T extends unknown[], U>(request: (...arr: T) => Promise<U>, params: Params) {
    if (params.pollingInterval) {
        return setFunctionInterval(request,params.pollingInterval).start
    } 
    return request
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useRequest<T extends unknown[], U>(request: Request<T, U>, params: Params) {
    const data = ref<U>(params.initialData) as Ref<U>
    const loading = ref(false)

    const baseRequest = async (...params: T): Promise<U> => {
        loading.value = true
        const res = await request(...params)
        data.value = res
        loading.value = false
        return data.value
    }

    const run = requestFactor<T, U>(baseRequest,params)
    // const run = baseRequest

    if(!params.manaul) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        run()
    }

    

    return {
        data,
        loading,
        run
    }
}