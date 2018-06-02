# dedup-json

This program provides a simple command line interface
for deduplicating JSON records.

## Installation

Make sure you have `node` and `npm` installed. I have tested
this with `node` version `8.11.2`, which is the latest LTS
version.

To install, simply run

```bash
npm install && npm run build
```

## Execution

To run the program, simply call

```bash
node dist/index.js
```

This will look for an input JSON file in `inbox/leads.json` off
of the current working directory. It will then output the deduplicated
JSON file to `outbox/leads.json` and a log file to `outbox/log.txt`.
A user can specify custom filepaths to the input, output, and log files
with the `-i, --input`, `-o, --output`, and `-l, --log` command line options,
respectively. The following command, reads `in.json` from the current directory,
outputs `out.json` to the current directory, and writes a log to `/tmp/log.txt`:

```bash
node dist/index.js -i in.json -o out.json -l /tmp/log.txt
```

For help with the command line options, call

```bash
node dist/index.js -h
```

## Assumptions

The program assumes a JSON file with a root `leads` field with an array of records
that have `_id` and `entryDate` fields.

## Testing

```bash
npm test
```
