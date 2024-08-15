import fs from 'fs/promises'
import path from 'path'

const dirname = import.meta.dirname
const ratingsFilePath = path.join(dirname, 'data-ratings.json')

export async function ratingsFind() {
    try {
        const data = await fs.readFile(ratingsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(ratingsFilePath, '[]');
            return []
        } else {
            throw error;
        }
    }
}

export async function ratingsGetAAverege() {
    const data = await ratingsFind()
    const totalRating = data.reduce((sum, obj) => sum + obj.rating, 0)
    const averageRating = totalRating / data.length
    return {
        averege: averageRating.toFixed(1),
        length: data.length
    }
}

export async function findById(data, userId) {
    const exitingUser = await data.find(rating => rating.userId === userId)

    if (exitingUser) return user
    return null
}

export async function findRatingsById(userId) {
    const data = await ratingsFind()
    const exitingUser = await data.find(rating => rating.userId === userId)

    if (exitingUser) return user
    return {}
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        year: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '');
}

export { ratingsFilePath }