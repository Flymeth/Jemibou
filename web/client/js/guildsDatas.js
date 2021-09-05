async function getGuildsDatas(token) {
    const guilds = await getGuilds(token)
    const guild_card = await getTemplate('guild_card')

    return {
        guilds,
        guild_card
    }
}