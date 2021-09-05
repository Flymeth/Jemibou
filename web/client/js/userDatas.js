async function getUserDatas(token) {
    if(!token) return false
    return await getUser(token)
}

async function displayUserDatas(user) {
    if(!user || typeof user !== "object") return
    
    user.avatar= `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    document.querySelectorAll('*[data-user]').forEach(el => {
        const need = el.getAttribute('data-user')
        const value = user[need]
        if(el.localName === 'img') {
            el.src= user.avatar
        }else el.innerText = value
    })
}