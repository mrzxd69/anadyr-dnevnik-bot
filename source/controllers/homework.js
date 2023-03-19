import { dayKeyboard, exitKeyboard, menuKeyboard } from "#addons/keyboards.js"
import postgresql from "#database/postgresql.js"
import getHomework from "#parser/getHomework.js"


export default async (ctx) => {
    const [user] = await postgresql(`SELECT * FROM users WHERE id = $1`, [ctx.senderId])
    let day

    while (!day?.context?.payload?.data) {
        day = await ctx.prompt(`Какой день недели желаете посмотреть?`, {
            reply_markup: dayKeyboard()
        })
    }

    if(day?.context?.payload?.data == 'exit') {
        return ctx.message.send(`Вы вернулись в главное меню`, {
            reply_markup: menuKeyboard()
        })
    }

    day = day.context.payload.data
    ctx.message.send(`⏳ Получаем домашнее задание. Это может занять некоторое время...`)
    
    try {

    } catch(e) {
        ctx.message.send(`При получении данных произошла ошибка. Пожалуйста, проверьте данные авторизации. Если данные не верны - выйдите из аккаунта и заново авторизуйтесь`)
    }
    const str = await getHomework(user.login, user.password, day)

    ctx.message.send(str, {
        parse_mode: "HTML",
        reply_markup: exitKeyboard()
    })
}