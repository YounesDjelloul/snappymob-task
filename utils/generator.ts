export class Generator {
    TARGET_SIZE = 10 * 1024 * 1024
    private static readonly CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    private static readonly NUMBERS = '0123456789'
    private static readonly CHUNK_SIZE = 1024 * 64
    private static readonly AVG_ITEM_LENGTH = 20

    private readonly alphaArray = Array.from(Generator.CHARS)
    private readonly numArray = Array.from(Generator.NUMBERS)
    private readonly alphaNumArray = Array.from(Generator.CHARS + Generator.NUMBERS)

    private randomFromArray(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    private generateAlphabetical(length: number = 8): string {
        return Array.from({length}, () => this.randomFromArray(this.alphaArray)).join('')
    }

    private generateReal(): string {
        const wholePart = Math.floor(Math.random() * 1000000)
        const decimalPart = Math.floor(Math.random() * 1000000)
        return `${wholePart}.${decimalPart}`
    }

    private generateInteger(): string {
        return Math.floor(Math.random() * 1000000).toString()
    }

    private generateAlphanumeric(): string {
        const length = Math.floor(Math.random() * 10) + 5
        const spacesBefore = ' '.repeat(Math.floor(Math.random() * 11))
        const spacesAfter = ' '.repeat(Math.floor(Math.random() * 11))

        const letter = this.randomFromArray(this.alphaArray)
        const number = this.randomFromArray(this.numArray)

        const remainingLength = length - 2
        const remainingChars = Array.from(
            {length: remainingLength},
            () => this.randomFromArray(this.alphaNumArray)
        ).join('');

        const chars = remainingChars + letter + number
        const shuffled = chars.split('').sort(() => Math.random() - 0.5).join('')

        return `${spacesBefore}${shuffled}${spacesAfter}`
    }

    private generateChunk(): string {
        const itemsPerChunk = Math.floor(Generator.CHUNK_SIZE / Generator.AVG_ITEM_LENGTH)
        const items: string[] = []

        for (let i = 0; i < itemsPerChunk; i++) {
            const type = i % 4
            switch (type) {
                case 0:
                    items.push(this.generateAlphabetical())
                    break;
                case 1:
                    items.push(this.generateReal())
                    break;
                case 2:
                    items.push(this.generateInteger())
                    break;
                case 3:
                    items.push(this.generateAlphanumeric())
                    break;
            }
        }

        return items.join(',')
    }

    async generateFile(): Promise<string> {
        const chunks: string[] = []
        let totalSize = 0

        while (totalSize < this.TARGET_SIZE) {
            const chunk = this.generateChunk()
            chunks.push(chunk)
            totalSize += chunk.length

            if (chunks.length % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0))
            }
        }

        return chunks.join(',')
    }
}