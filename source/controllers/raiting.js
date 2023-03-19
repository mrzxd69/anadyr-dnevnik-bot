import postgresql from "#database/postgresql.js"

export default async(ctx) => {
    const users = await postgresql(`SELECT * FROM users ORDER BY avg DESC LIMIT 15`)
    let top = ""
    let currentPosition = 0

    for(let i in users) {
        currentPosition++
        top += `${currentPosition}) ${users[i].username == '@undefined' ? 'Неизвестный' : users[i].username} - ${users[i].avg}\n`
    }

    ctx.message.send(
        `Топ учеников по среднему баллу:\n\n` +
        top +
        `\n\nЗарабатывай хорошие оценки и поднимайся на первое место топа!`
    )
}