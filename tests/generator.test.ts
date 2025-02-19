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

        it('should contain alphanumerics with both letters and numbers', () => {
            const items = sampleData.split(',')
            const hasProperAlphanumerics = items.some(item => {
                return /^\s*(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+\s*$/.test(item)
            })
            expect(hasProperAlphanumerics).toBe(true)
        })
    })

    describe('when generating a file', () => {
        it('should create a file of approximately 10MB in size', async () => {
            const data = await generator.generateFile()
            const sizeInMB = new Blob([data]).size / (1024 * 1024)

            expect(sizeInMB).toBeGreaterThanOrEqual(9.9)
            expect(sizeInMB).toBeLessThanOrEqual(10.1)
        })

        it('should generate data with comma-separated values', async () => {
            const data = await generator.generateFile()
            const items = data.split(',')

            expect(items.length).toBeGreaterThan(1)
            expect(data).toMatch(/^[^,]+(?:,[^,]+)*$/)
        })
    })

    describe('when handling edge cases', () => {
        let sampleData: string

        beforeEach(async () => {
            generator.TARGET_SIZE = 1000
            sampleData = await generator.generateFile()
        })

        it('should not generate empty strings', async () => {
            const data = await generator.generateFile()
            const items = data.split(',')
            const hasEmptyStrings = items.some(item => item.trim() === '')
            expect(hasEmptyStrings).toBe(false)
        })

        it('should not have consecutive commas', async () => {
            const data = await generator.generateFile()
            expect(data).not.toMatch(/,,/)
        })
    })
})