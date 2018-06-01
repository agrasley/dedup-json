import program from 'commander'
import path from 'path'
import fs from 'fs-extra'

import { Record } from './dedup'

/**
 * Format a path from the command line args
 * @param {string} p - The path to format
 * @returns {string} - The formatted path
 */
const formatPath = (p) => {
    if (path.isAbsolute(p)) {
        return p
    } else {
        return path.join(__dirname, p) // TODO: is this correct?
    }
}

/** Command line args */
program
    .version('0.0.1')
    .option('-i, --input [path]',
            'the json file to dedup (default: inbox/leads.json)',
            '../inbox/leads.json')
    .option('-o, --output [path]',
            'the output json file (default: outbox/leads.json)',
            '../outbox/leads.json')
    .option('-l, --log [path]',
            'the log file (default: outbox/log.txt)',
            '../outbox/log.txt')
    .parse(process.argv)

const deduped = fs.readFile(formatPath(program.input))
    .then(data => {
        return Record.dedup(Record.fromJSON(data))
    })

const writePath = formatPath(program.output)
const outDir = fs.ensureDir(path.dirname(writePath))

Promise.all([deduped, outDir])
    .then(values => {
        return fs.writeFile(writePath, Record.toJSON(values[0]))
    })
