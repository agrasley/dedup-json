import program from 'commander'
import path from 'path'
import fs from 'fs-extra'

import { Record, Logger } from './dedup'

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

const logger = new Logger()
const deduped = fs.readFile(formatPath(program.input))
    .then(data => {
        const recs = Record.fromJSON(data)
        logger.records = recs
        return Record.dedup(recs, logger)
    })

const writePath = formatPath(program.output)
const logPath = formatPath(program.log)
const outDir = fs.ensureDir(path.dirname(writePath))
const logDir = fs.ensureDir(path.dirname(logPath))

Promise.all([deduped, outDir])
    .then(values => {
        return fs.writeFile(writePath, Record.toJSON(values[0]))
    })

Promise.all([deduped, logDir])
    .then(values => {
        return fs.writeFile(logPath, logger.logChanges())
    })
