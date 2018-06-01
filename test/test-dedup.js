'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { dedup, Record } = require('../src/dedup.js')

describe('dedup', function () {
    it('should dedup [1,1,1] to [1]', function () {
        assert.deepEqual(dedup(x => x, x => true, [1,1,1]),[1])
    })
})

describe('Record', function () {
    describe('#constructor', function () {
        it('creates a new Record', function () {
            const rec = new Record({a: "hello"}, 1)
            assert.equal(rec.record.a, "hello")
            assert.equal(rec.idx, 1)
        })
    })

    describe('#fromJSON', function () {
        it('creates an array of records from JSON input', function (done) {
            fs.readFile(path.join(__dirname, '../inbox/leads.json'), (err, data) => {
                if (err) done(err)
                const recs = Record.fromJSON(data)
                assert.equal(recs.length, 10)
                assert.equal(recs[5].idx, 5)
                assert.equal(recs[7].record.email, 'foo@bar.com')
                done()
            })
        })
    })

    describe('#compare', function () {
        const x = new Record({entryDate: "2014-05-07T17:33:20+00:00"}, 0)
        const y = new Record({entryDate: "2014-05-07T17:33:20+00:01"}, 1)
        const z = new Record({entryDate: "2014-05-07T17:33:20+00:01"}, 2)

        it('returns true when the left arg is newer', function () {
            assert.ok(Record.compare(y, x))
        })

        it('returns false when the right arg is newer', function () {
            assert.ok(!Record.compare(x, y))
        })

        it('returns true when both args have the same date and the left arg came last', function () {
            assert.ok(Record.compare(z, y))
        })

        it('returns false when both args have the same date and the right arg came last', function () {
            assert.ok(!Record.compare(y, z))
        })
    })
})
