let statusState = 0
module.exports.next = async (vars) => {
    let status = [
        {
            "text": "version " + vars.package.version,
            "type": "WATCHING"
        },
        {
            "text": vars.client.guilds.cache.size + " servers",
            "type": "COMPETING"
        }
    ]

    if(statusState >= status.length) statusState = 0

    try {
        vars.client.user.setActivity(status[statusState].text, {type: status[statusState].type})
    } catch (err) {
        return false
    }

    let returnMessage = `Set status!\n\n__Text:__ "*${status[statusState].text}*"\n__Type:__ "*${status[statusState].type}*"`
    statusState++

    return returnMessage
}