const {Axios} = require('axios')
module.exports = {
    url: '/client',
    method: "GET",
    active: true,

    value: async (vars, url, chuncks) => {
        let token = url.searchParams.get('token')
        if(!token) return undefined
        try {
            token = JSON.parse(token)
        } catch (e) {
            return undefined
        }
        const {type, access} = token
        if(!type || !access) return undefined

        const request = new Axios({})
        let user = await request.get('https://discord.com/api/v9/users/@me', {
            headers: {
                authorization: `${type} ${access}`,
                "Content-Type": "application/json"
            }
        })
        if(user.status !== 200) user = undefined
        else user = JSON.parse(user.data)

        let guilds = await request.get('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                authorization: `${type} ${access}`,
                "Content-Type": "application/json"
            }
        })
        if(guilds.status !== 200) guilds = undefined
        else guilds = JSON.parse(guilds.data)

        return {user, guilds}
    }
}