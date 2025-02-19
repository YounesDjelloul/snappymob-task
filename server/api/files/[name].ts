import {defineEventHandler} from 'h3'
import {readFile} from 'fs/promises'
import {resolve} from 'path'

export default defineEventHandler(async (event) => {
    if (!event.context.params?.name) {
        throw createError({
            statusCode: 400,
            message: 'Filename is required'
        })
    }

    const fileName = event.context.params.name
    const filePath = resolve('./generated_files', fileName)

    try {
        return await readFile(filePath, 'utf-8')
    } catch (error) {
        console.error('Error reading file:', error)
        throw createError({
            statusCode: 404,
            message: 'File not found'
        })
    }
})