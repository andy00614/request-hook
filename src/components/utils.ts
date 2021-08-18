function mockRequest<T>(body:T): Promise<T>{
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(body)
        }, 2000);
    })
}
export { mockRequest }