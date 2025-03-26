export function sleep(seconds: number) {
    return new Promise((res, rej) => {
        setTimeout(res, (seconds * 1000));
    })
}