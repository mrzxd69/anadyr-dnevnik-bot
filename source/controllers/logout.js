import postgresql from "#database/postgresql.js"

export default async(ctx) => {
    const [user] = await postgresql(`SELECT * FROM users WHERE id = $1`, [ ctx.senderId ])

    if(!user) {
        return ctx.message.send(`Вы и так не авторизованы!`)
    } 

    await postgresql(`DELETE FROM users WHERE id = $1`, [ ctx.senderId ])
    ctx.message.send(
        `👋 Вы успешно вышли из своего аккаунта\n\n` + 
        `Чтобы войти заново напишите: /start`
    )
}