let user;
let guilds;
async function login(token, guild) {
    console.log("LOGIN YOU WITH TOKEN " + token.access)
    const infos = await getAccount(token)
    user = infos?.user
    guilds = infos?.guilds
    if(!user) return register()

    const dashboard = await getTemplate('dashboard')
    
    mainContent.innerHTML = dashboard
    mainContent = document.querySelector('.dashboard')
    
    // user informations
    displayUserDatas(user)

    clickEvent()

    // user disconnection
    document.querySelectorAll('.disconnect').forEach(e => {
        e.addEventListener('click', (e) => {
            e.preventDefault()
            document.cookie = `${accountCookieName}=false`
            // supprimer le cookie
            window.location.reload()
        })
    })
    

    showGuilds(guild)
}