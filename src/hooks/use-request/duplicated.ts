import { computed, reactive, Ref, ref, toRefs } from '@vue/composition-api';
import { PaginationResult, Params, Request, requestFactor } from './type';
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useRequest<T extends unknown[], U>(request: Request<T, U>, options: Params={}) {
    const data = ref<U>(options.initialData) as Ref<U>
    const loading = ref(false)
    const cancelRequestFlag = ref(false)
    const pagination = reactive({
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageCount: 0,
    })

    let requestIndex = 0;

    const setCancelRequestFlag = (val: boolean) => {
        cancelRequestFlag.value = val
    }

    const setPaginationTotal = (total:number) => {
        pagination.total = total
    }

    const resetPaginationCurrent = () => {
        pagination.currentPage = 1
    }

    const cancelRequest = () => {
        setCancelRequestFlag(true)
        loading.value = false
    }

    // 这个应该是个单例，否则连续执行run会出问题
    function setFunctionInterval<T extends unknown[],U>(request: (...arr: T) => Promise<U>,time = 1000) {
        let timer: NodeJS.Timer;
        let result:U
        return {
            async start(...params: T) {
                // timer为单例，否则在手动请求的情况下会执行好多个定时器
                result = await request(...params)
                if(timer) {
                    return result
                }
                timer = setInterval(async () => {
                    result = await request(...params)
                }, time);
                return result
            },
            stop() {
                loading.value = false
                clearInterval(timer)
            }
        }
    }

    const baseRequest = async (...params: T): Promise<U> => {
        setCancelRequestFlag(false)
        requestIndex += 1;
        const curRequestIndex = requestIndex
        loading.value = true
        const res = await request(...params)
        if(requestIndex === curRequestIndex || cancelRequestFlag.value) {
            data.value = res
            if(options.paginated) {
                const total = (data.value as unknown as PaginationResult).total
                setPaginationTotal(total)
            }
        }
        loading.value = false
        return data.value
    }

    function requestFactor<T extends unknown[], U>(request: (...arr: T) => Promise<U>, params: Params): requestFactor<T, U> {
        if(params.throttleInterval && params.debounceInterval) {
            throw Error(`throttleInterval and debounceInterval can't together setting`)
        }
        let machinedRequest = request;
        if(params.debounceInterval) {
            machinedRequest = debounce(machinedRequest,params.debounceInterval) as  (...arr: T) => Promise<U>
        } 
        if(params.throttleInterval) {
            machinedRequest = throttle(machinedRequest,params.debounceInterval) as  (...arr: T) => Promise<U>
        }
        if (params.pollingInterval) {
            const fn = setFunctionInterval(machinedRequest,params.pollingInterval)
            return {
                run: fn.start,
                cancel: fn.stop,
            }
        }
        return {
            run: machinedRequest,
            cancel: cancelRequest
        }
    }

    const { run, cancel } = requestFactor<T, U>(baseRequest,options)

    const currentChange = async (current: number) => {
        pagination.currentPage = current
        // TODO: 这里的类型适配
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // TODO: 这里的入参有没有必要改成对象形式，那U的类型要改
        await run(current,pagination.pageSize) as PaginationResult
    }

    const sizeChange = (size: number) => {
        pagination.pageSize = size;
        resetPaginationCurrent()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        run(current,pagination.pageSize) as PaginationResult
    }

    if(!options.manaul) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        run()
    }

    const paginationForElementUi = computed(() => ({
        total: pagination.total,
        'current-page': pagination.currentPage,
        'page-size': pagination.pageSize,
        'page-count': pagination.pageCount,
    }))

    return {
        data,
        loading,
        run,
        cancel,
        pagination: paginationForElementUi,
        paginationEvent: {
            'current-change': currentChange,
            'size-change': sizeChange
        },
    }
}