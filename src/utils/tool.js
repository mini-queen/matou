export function debounce (fn, delay) { // 做计时操作
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
