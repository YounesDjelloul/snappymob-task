import {describe, it, expect, beforeEach} from 'vitest'
import {Generator} from '~/utils/generator'

describe('Data Generator', () => {
    let generator: Generator

    beforeEach(() => {
        generator = new Generator()
    })

    describe('when examining generated content', () => {
        let sampleData: string

        beforeEach(async () => {
            generator.TARGET_SIZE = 1000
            sampleData = await generator.generateFile()
        })

        it('should contain alphabetical strings', () => {
            const items = sampleData.split(',')
            const hasAlphabetical = items.some(item => /^[a-zA-Z]+$/.test(item.trim()))
            expect(hasAlphabetical).toBe(true)
        })

        it('should contain real numbers', () => {
            const items = sampleData.split(',')
            const hasRealNumbers = items.some(item => /^\d+\.\d+$/.test(item.trim()))
            expect(hasRealNumbers).toBe(true)
        })

        it('should contain integers', () => {
            const items = sampleData.split(',')
            const hasIntegers = items.some(item => /^\d+$/.test(item.trim()))
            expect(hasIntegers).toBe(true)
        })
    })
})