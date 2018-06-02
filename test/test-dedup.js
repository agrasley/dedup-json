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

    describe('#keep', function () {
        const x = new Record({entryDate: "2014-05-07T17:33:20+00:00"}, 0)
        const y = new Record({entryDate: "2015-05-07T17:33:20+00:00"}, 1)
        const z = new Record({entryDate: "2015-05-07T17:33:20+00:00"}, 2)

        it('returns true when the caller is newer', function () {
            assert.ok(y.keep(x))
        })

        it('returns false when the arg is newer', function () {
            assert.ok(!x.keep(y))
        })

        it('returns true when both args have the same date and the left arg came last', function () {
            assert.ok(z.keep(y))
        })

        it('returns false when both args have the same date and the right arg came last', function () {
            assert.ok(!y.keep(z))
        })
    })

    describe('#dedup', function () {
        it('deduplicates an array of records', function (done) {
            fs.readFile(path.join(__dirname, '../inbox/leads.json'), (err, jsonLeads) => {
                if (err) done(err)
                fs.readFile(path.join(__dirname, './leads-deduped.json'), (err, jsonDeduped) => {
                    if (err) done(err)
                    const leads = Record.fromJSON(jsonLeads)
                    const deduped = Record.fromJSON(jsonDeduped)
                    assert.equal(Record.dedup(leads).length, deduped.length)
                    done()
                })
            })
        })
    })
})
