export const dedup = (toKey, compare, xs) => {
    const map = {}
    xs.forEach((x, i) => {
        const key = toKey(x)
        const existing = map[key]
        if (existing && compare(existing, x)) {
            // TODO: logging
        } else {
            // TODO: logging
            map[key] = x
        }
    })
    return Object.values(map)
}
