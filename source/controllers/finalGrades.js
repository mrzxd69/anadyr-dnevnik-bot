import { exitKeyboard } from "#addons/keyboards.js"
import postgresql from "#database/postgresql.js"
import getFinal from '#parser/getFinal.js'



export default async (ctx) => {
    ctx.message.send(`⏳ Получаем оценки. Это может занять некоторое время...`)
    const [user] = await postgresql(`SELECT * FROM users WHERE id = $1`, [ ctx.senderId ])

    if(!user?.login || !user?.password) return ctx.message.send(
        `Для использования бота, нужна авторизация Вашего аккаунта`
    )

    await getFinal(user.login, user.password).then(async data => {
        await ctx.message.send(
            `Предмет/1ч./2ч./3ч./4ч./Год/Экз\n\n` +
            data, {
                parse_mode: "HTML",
            }
        )

        ctx.message.send(
            `📕 Если какого-то столбца нет, скорее всего, данный этап обучения ещё не наступил`, {
                reply_markup: exitKeyboard()
            }
        )
    }).catch(e => {
        ctx.message.send(`${e}`, {
            reply_markup: exitKeyboard()
        })
    })
}