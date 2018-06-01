/**
 * deduplicate an array
 * @param {function(T1):string} toKey - Function to convert items in the array to a key.
 * @param {function(T1,T1):boolean} compare - Comparison function for duplicate items.
 * Returns true if the left argument should be kept.
 * @param {array<T1>} xs - The array to deduplicate.
 * @returns {array<T1>} - The deduplicated array
 */
export const dedup = (toKey, compare, xs) => {
    const map = {} // a map to check for duplicates
    xs.forEach((x, i) => {
        const key = toKey(x) // get the key for the item
        const existing = map[key] // get any existing item for that key
        if (existing && compare(existing, x)) { // keep the existing item
            // TODO: logging
        } else {
            // TODO: logging
            map[key] = x // replace the existing item
        }
    })
    return Object.values(map) // return the deduplicated array
}

/** A record to dedup */
export class Record {

    /**
     * Create a new record
     * @param {Object} record - The parsed JSON record
     * @param {number} idx - The original index of the record
     * @returns {Record}
     */
    constructor (record, idx) {
        this.record = record
        this.idx = idx
    }

    /**
     * Create an array of records from a JSON string
     * @param {string} jsonStr - The JSON string to parse.
     * @returns {array<Record>} - The Records parsed from the string.
     */
    static fromJSON (jsonStr) {
        const leads = JSON.parse(jsonStr).leads
        return leads.map((x,i) => new Record(x,i))
    }

    /**
     * Create a JSON string from an array of records
     * @param {array<Record>} recs - Records to convert
     * @returns {string} - The JSON string
     */
    static toJSON (recs) {
        const leads = []
        recs.forEach(r => leads.push(r.record))
        return JSON.stringify(leads, null, 2)
    }

    /**
     * compare records
     * @param {Record} x
     * @param {Record} y
     * @returns {boolean} - True if the left argument should be kept.
     */
    static compare (x, y) {
        const xDate = Date.parse(x.record.entryDate)
        const yDate = Date.parse(x.record.entryDate)
        if (xDate > yDate) { // x is newer
            return true
        } else if (xDate < yDate) { // y is newer
            return false
        } else if (x.idx > y.idx) { // x came after y
            return true
        } else { // y came after x
            return false
        }
    }

    /**
     * deduplicate an array of records
     * @param {array<Record>} recs - The records to deduplicate
     * @returns {array<Record>} - The deduplicated records
     */
    static dedup (recs) {
        const recs_ = dedup(r => r.record._id, Record.compare, recs) // dedup by id
        return dedup(r => r.record.email, Record.compare, recs_) // dedup by email
    }
}

