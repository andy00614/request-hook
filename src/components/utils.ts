function mockRequest<T>(body:T): Promise<T>{
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('qingqiu');
            resolve(body)
        }, 2000);
    })
}
export { mockRequest }