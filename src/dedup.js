/**
 * deduplicate an array
 * @param {function(T1):string} toKey - Function to convert items in the array to a key.
 * @param {function(T1,T1):boolean} compare - Comparison function for duplicate items.
 * Returns true if the left operand should be kept.
 * @param {array<T1>} xs - The array to deduplicate.
 */
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
