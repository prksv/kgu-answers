import prefix from "./prefix.js";

export default async (conversation, ctx) => {
    await conversation.run(prefix)

    await ctx.reply("введите кодовое слово:");
    const { message } = await conversation.wait();

    if (message.text == 'подпросековик') {
        console.log(ctx.prefix + ' авторизован')
        conversation.session.allowed_users.push(ctx.from.id);
        await ctx.reply(`здарова заебал, доступ разрешен`);
        return
    } else {
        console.log(ctx.prefix + ` ошибка авторизации, ввел "${message.text}"`)

        await ctx.reply(`пошел нахуй`);
    }
}

