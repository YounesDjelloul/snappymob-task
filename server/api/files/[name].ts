import {defineEventHandler} from 'h3'
import {readFile} from 'fs/promises'
import {resolve} from 'path'

export default defineEventHandler(async (event) => {
    const fileName = event.context.params.name
    const filePath = resolve('./generated_files', fileName)

    try {
        const content = await readFile(filePath, 'utf-8')
        return content
    } catch (error) {
        console.error('Error reading file:', error)
        throw createError({
            statusCode: 404,
            message: 'File not found'
        })
    }
})