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

    private generateSequence(): string {
        const items = [
            this.generateAlphabetical()
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