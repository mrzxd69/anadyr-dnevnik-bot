import config from '../config.js'
import pg from 'pg'

const db = new pg.Client(config.postgresql)

await db
    .connect()
    .then(() => console.log(`postgresql connected`))

export default (sql, params) => {
    return new Promise(async (resolve, reject) => {
        await db.query(sql, params)
            .then(r => resolve(r.rows))
            .catch(err => reject(err))
    })
}