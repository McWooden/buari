import fs from 'fs/promises'
import path from 'path'

const dirname = import.meta.dirname

export async function ratingsFind() {
    const filePath = path.join(dirname, 'data-ratings.json')

    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]');
            return []
        } else {
            throw error;
        }
    }
}

export async function findUserFromDataById(data, userId) {
    const exitingUser = await data.find(rating => rating.userId === userId)

    if (exitingUser) {
        ratings[existingRatingIndex] = {
            userId: message.from,
            rating: nilai,
            timestamp: new Date().toISOString()
        }
        return user
    } else {
        ratings.push({
            userId: message.from,
            rating: nilai,
            timestamp: new Date().toISOString()
        })
        return 
    }
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