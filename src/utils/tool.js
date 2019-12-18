export function debounce (fn, delay) {
    let timer = ''
    return function () {
        let context = this
        let args = arguments
        timer && clearTimeout(timer)
        timer = setTimeout(function () {
        fn.apply(context, args)
        }, delay)
    }
}
