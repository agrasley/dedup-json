import program from 'commander'

import { Record } from './dedup'

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
