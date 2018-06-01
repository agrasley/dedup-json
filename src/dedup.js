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

export const compareRecs = (x, y) => {
    const xDate = Date.parse(x.record.entryDate)
    const yDate = Date.parse(x.record.entryDate)
    if (xDate > yDate) {
        return true
    } else if (xDate < yDate) {
        return false
    } else if (x.idx > y.idx) {
        return true
    } else {
        return false
    }
}
