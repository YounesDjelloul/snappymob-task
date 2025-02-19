import {defineEventHandler, readBody} from 'h3'
import {readdir, writeFile} from 'fs/promises'
import {resolve} from 'path'

export default defineEventHandler(async (event) => {
    const dirPath = resolve('./generated_files')

    if (event.method === 'GET') {
        try {
            const files = await readdir(dirPath)
            return files.filter(file => file.endsWith('.txt'))
        } catch (error) {
            console.error('Error reading directory:', error)
            return []
        }
    }

    if (event.method === 'POST') {
        try {
            const body = await readBody(event)
            const {filename, content} = body

            await writeFile(resolve(dirPath, filename), content)
            return {success: true}
        } catch (error) {
            console.error('Error saving file:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to save file'
            })
        }
    }
})