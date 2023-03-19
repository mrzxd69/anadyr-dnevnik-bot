import { menuKeyboard } from "#addons/keyboards.js"


export default (ctx) => {
    ctx.message.send(`✨ Вы вернулись в главное меню...`, {
        reply_markup: menuKeyboard()
    })
}