import program from 'commander'
import path from 'path'

import { Record } from './dedup'

/**
 * Format a path from the command line args
 * @param {string} - The path to format
 * @returns {string} - The formatted path
 */
const formatPath = (path) => {
    if (path.isAbsolute(path)) {
        return path
    } else {
        return path.join(__dirname, path) // TODO: is this correct?
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
