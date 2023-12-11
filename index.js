import {
    Bot, session
} from "grammy";

import fs from "fs"
import {conversations, createConversation} from "@grammyjs/conversations";
import auth from "./auth.js";
import prefix from "./prefix.js";

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const answers = loadJSON('./answers.json');

const TOKEN = "6802816602:AAEF3Ob4YXC9CwaG5LNwLbcK7n2xP60bBmI"
const bot = new Bot(TOKEN)

function initial() {
    return { allowed_users: [] };
}
bot.use(session({ initial }));
bot.use(conversations());
bot.use(createConversation(auth, 'auth'))

bot.use(prefix)

bot.command("start", async ctx => {
    console.log(ctx.prefix + ` начал бота`)

    await ctx.reply("здарова, меня сделал подпросековик чтобы нагнуть тесты волка.\nпросто введи начало вопроса, я выдам возможные ответы\nесли этот бот вам поможет на зачете - с вас сырная шавуха. удачи! \n https://t.me/snakePattern")
})

bot.on('message:text', async ctx => {
    if (!ctx.session.allowed_users.includes(ctx.from.id)) {
        console.log(ctx.prefix + ' не авторизован')
        await ctx.conversation.enter('auth')
        return;
    }

    if (ctx.message.text.length <= 2) {
        console.log(ctx.prefix + ' пишет меньше 2 слов')
        await ctx.reply('еще раз так сделаешь я тебе по ебалу настучу')
        return
    }

    if (ctx.message.text.length <= 6) {
        console.log(ctx.prefix + ' пишет меньше 6 слов')
        await ctx.reply('пиши подробнее сука')
        return
    }


    const filtered = answers.filter(question =>
        question.message.toLowerCase().includes(ctx.message.text.toLowerCase())
    )

    console.log(ctx.prefix + ` гуглит "${ctx.message.text}". Найдено ${filtered.length} ответов.`)


    if (filtered.length <= 0) {
        await ctx.reply('вопрос не найден')
    }

    filtered.map(async question => {
        let message = `*${question.message}*` + "\n";

        let counter = 1;

        question?.answers.forEach(answer => {
            message += `\n${counter}. ${answer}`
            counter++
        })

        await ctx.reply(message, { parse_mode: "Markdown" })
    })
})

bot.start()