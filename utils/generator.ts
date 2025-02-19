export class Generator {
    TARGET_SIZE = 10 * 1024 * 1024;
    private static readonly CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static readonly NUMBERS = '0123456789';

    private generateAlphabetical(length: number = 8): string {
        return Array.from(
            {length},
            () => Generator.CHARS[Math.floor(Math.random() * Generator.CHARS.length)]
        ).join('');
    }

    private generateReal(): string {
        const wholePart = Math.floor(Math.random() * 1000000);
        const decimalPart = Math.floor(Math.random() * 1000000);
        return `${wholePart}.${decimalPart}`;
    }

    private generateInteger(): string {
        return Math.floor(Math.random() * 1000000).toString();
    }

    private generateAlphanumeric(): string {
        const length = Math.floor(Math.random() * 10) + 5
        const spacesBefore = ' '.repeat(Math.floor(Math.random() * 11))
        const spacesAfter = ' '.repeat(Math.floor(Math.random() * 11))

        const chars = Generator.CHARS + Generator.NUMBERS
        const value = Array.from(
            {length},
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join('')

        return `${spacesBefore}${value}${spacesAfter}`
    }

    private generateSequence(): string {
        const items = [
            this.generateAlphabetical(),
            this.generateReal(),
            this.generateInteger(),
            this.generateAlphanumeric(),
        ];
        return items.join(',');
    }

    async generateFile(): Promise<string> {
        let output = ''
        let currentSize = 0

        while (currentSize < this.TARGET_SIZE) {
            const sequence = this.generateSequence()
            output += sequence + ','
            currentSize = new Blob([output]).size
        }

        return output.slice(0, -1)
    }
}