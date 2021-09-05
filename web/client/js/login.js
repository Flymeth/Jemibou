let user;
async function login(token, guild) {
    console.log("LOGIN YOU WITH TOKEN " + token.access)
    user = await getUserDatas(token)
    if(!user) return register()

    const dashboard = await getTemplate('dashboard')
    
    mainContent.innerHTML = dashboard
    mainContent = document.querySelector('.dashboard')
    
    // user informations
    displayUserDatas(user)

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