import postgresql from '#database/postgresql.js'
import { menuKeyboard } from '#addons/keyboards.js'

const PASSWORD = "https://sun6-21.userapi.com/impg/Ps1otWaGr2Gu-cRhf3Tk293EfT2n1hMMPt73rA/7wM83lqrczI.jpg?size=477x654&quality=96&sign=127b0d4f3e95d1197aa3bbe863d1589d&type=album"
const USERNAME = "https://sun9-46.userapi.com/impg/fUyHq2WaExAfYkHYkdzhL4ZTWzzNvpwOzwDeJg/k8G-jYbur2E.jpg?size=477x654&quality=96&sign=a5defe815e7a646f290aa2f87370f870&type=album"

export default async (ctx) => {
    const {
        context: login
    } = await ctx.prompt(`⭐️ Добро пожаловать!\n\nДля начала нужно авторизоваться\n\n✍️ Напишите логин от Вашего аккаунта в дневнике: <a href="${USERNAME}">&#8205;</a>`, {
        parse_mode: "HTML"
    })


    const {
        context: password
    } = await ctx.prompt(`⭐️ Отлично!\n\nТеперь напишите пароль от аккаунта:<a href="${PASSWORD}">&#8205;</a>`, {
        parse_mode: "HTML"
    })
    
    if (login.text && password.text) { 
        await postgresql(`INSERT INTO users(id, login, password, username) VALUES($1, $2, $3, $4) ON CONFLICT(id) DO UPDATE SET username = $4`, [
            ctx.senderId, login.text, password.text, "@" + ctx.from.username
        ])

        return ctx.send(
            `✅ Авторизация успешна!\n\n` +
            `Весь функционал предоставлен ниже`, {
                reply_markup: menuKeyboard()
            }
        )
    } 
}