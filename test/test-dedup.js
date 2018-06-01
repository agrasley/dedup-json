'use strict'

const assert = require('assert')
const { dedup } = require('../src/dedup.js')

describe('dedup', function () {
    it('should dedup [1,1,1] to [1]', function () {
        assert.deepEqual(dedup(x => x, x => true, [1,1,1]),[1])
    })
})
