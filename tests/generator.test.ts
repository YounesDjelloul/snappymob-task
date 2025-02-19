import {describe, it, expect, beforeEach} from 'vitest'
import {Generator} from '~/utils/generator'

describe('Data Generator', () => {
    let generator: Generator

    beforeEach(() => {
        generator = new Generator()
    })

    describe('addition', () => {
        it('should add two numbers', () => {
            const addition = 1 + 1
            expect(2).toEqual(addition)
        })
    })
})