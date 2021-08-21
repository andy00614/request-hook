function mockRequest<T>(body:T,time = 200): Promise<T>{
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('mockRequest exec');
            resolve(body)
        }, time);
    })
}
export { mockRequest }