export default async (
    ctx,
    next
) => {
    ctx.prefix = `${ctx.from.first_name} ${ctx.from.last_name ?? ''} (@${ctx.from.username}) [${ctx.from.id}]`;
    await next();
}