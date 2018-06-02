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
        if (!(existing && compare(existing, x))) {
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
    constructor(record, idx) {
        this.record = record
        this.idx = idx
    }

    /**
     * Create an array of records from a JSON string
     * @param {string} jsonStr - The JSON string to parse.
     * @returns {array<Record>} - The Records parsed from the string.
     */
    static fromJSON(jsonStr) {
        const data = JSON.parse(jsonStr)
        if (!data.leads) {
            throw new Error('Parsed JSON has no "leads" field')
        }
        return data.leads.map((x,i) => {
            if (!x.entryDate) {
                throw new Error('Parsed JSON record has no "entryDate" field')
            } else if (!x._id) {
                throw new Error('Parsed JSON record has no "_id" field')
            } else {
                return new Record(x,i)
            }
        })
    }

    /**
     * Create a JSON string from an array of records
     * @param {array<Record>} recs - Records to convert
     * @returns {string} - The JSON string
     */
    static toJSON(recs) {
        const leads = []
        recs.forEach(r => leads.push(r.record))
        return JSON.stringify({leads: leads}, null, 2)
    }

    /**
     * compare records
     * @param {Record} other - Other record to compare
     * @param {?Logger} logger
     * @returns {boolean} - True if this Record should be kept.
     */
    keep (other, logger){
        const thisDate = Date.parse(this.record.entryDate)
        const otherDate = Date.parse(other.record.entryDate)
        if (thisDate > otherDate) { // this is newer
            if (logger) logger.replaces(other, this)
            return true
        } else if (thisDate < otherDate) { // other is newer
            if (logger) logger.replaces(this, other)
            return false
        } else if (this.idx > other.idx) { // this came after other
            if (logger) logger.replaces(other, this)
            return true
        } else { // other came after this
            if (logger) logger.replaces(this, other)
            return false
        }
    }

    /**
     * deduplicate an array of records
     * @param {array<Record>} recs - The records to deduplicate
     * @param {?Logger} logger
     * @returns {array<Record>} - The deduplicated records
     */
    static dedup(recs, logger) {
        const recs_ = dedup(r => r.record._id, (x,y) => x.keep(y, logger), recs) // dedup by id
        return dedup(r => r.record.email, (x,y) => x.keep(y, logger), recs_) // dedup by email
    }
}

/** Handles logging */
export class Logger {

    /**
     * create a new logger
     * @returns {Logger}
     */
    constructor() {
        this.records = [] // field for the original records
        this.mapping = [] // a mapping of record replacements
    }

    /**
     * logs when the second argument replaces the first
     * @param {Record} x
     * @param {Record} y
     */
    replaces(x,y) {
        this.mapping[x.idx] = y.idx
    }

    /**
     * produce the logging string output
     * @returns {string}
     */
    logChanges() {

        /**
         * get the index of the output record for a source record
         * @param {number} x - The source record index
         * @returns {number} - The output record index
         */
        const getOutput = x => {
            let outIdx = x
            while (this.mapping[outIdx]) { // traverse the mapping
                outIdx = this.mapping[outIdx]
            }
            return outIdx
        }

        /**
         * log the changes for fields of a record
         * @param {Object} src - Source record
         * @param {Object} out - Output record
         * @returns {string}
         */
        const logFields = (src, out) => {
            let s = ''
            Object.keys(src).forEach(k => {
                const srcVal = src[k]
                const outVal = out[k]
                if (srcVal === outVal) {
                    s += `field "${k}": unchanged\n`
                } else {
                    s += `field "${k}": ${srcVal} ==> ${outVal}\n`
                }
            })
            return s
        }

        /**
         * log the change for an individual source record
         * @param {Record} x - The source record
         * @returns {string}
         */
        const logChange = x => {
            const out = this.records[getOutput(x.idx)]
            return `SOURCE RECORD ${x.idx+1}:`
                 + `\n\n${JSON.stringify(x.record, null, 2)}`
                 + `\n\nOUTPUT RECORD:`
                 + `\n\n${JSON.stringify(out.record, null, 2)}`
                 + `\n\nFIELD CHANGES:`
                 + `\n\n${logFields(x.record,out.record)}\n`
        }

        let s = ''
        this.records.forEach(x => { s += logChange(x) })
        return s
    }
}
