
import { Telegram } from "puregram"
import { PromptManager } from '@puregram/prompt'
import config from "./config.js"
import start from "./controllers/start.js"

const telegram = new Telegram({
    token: config.botToken
})

const promptManager = new PromptManager()

telegram.updates.use(promptManager.middleware)

telegram.updates.on("message", async ctx => {
    if(ctx.text == '/start') start(ctx)
})

telegram.updates.on("callback_query", async ctx => {
    const action = ctx.payload.data

    return (await import(`./controllers/${action}.js`)).default(ctx)
})

telegram.updates
    .startPolling()
    .then(() => console.log('start'))