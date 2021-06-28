const fs = require('fs')
const { log, channels } = require('../configs.json')
module.exports.log = async (message, color, type, private, vars) => {
    
    if(!log.active ||!message) return false
    
    try {
        var file = fs.readFileSync(log.filePath, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    if(!file) file = ""

    let newLog = message
    let typeLog = newLog

    if(type) {
        typeLog = "(" + type + ") " + newLog
    }

    if(log.logDate) {
        let date = new Date()
        let dateMsg = `[${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} (${date.getHours()}:${date.getMinutes()}" ${date.getSeconds()}.${date.getMilliseconds()})]`
        
        newLog = dateMsg + "=> " + typeLog
    }

    if(!private) {
        const embed = new vars.discord.MessageEmbed()
    
        .setDescription(typeLog)
        .setColor(color || log.embedColor || "RANDOM")
        .setTimestamp()
    
        try {
            for(let channel of channels.logs) {
                let c = vars.client.channels.cache.get(channel)
                if(!c || !c.isText()) return false
                await c.send(embed)
            }
        } catch (err) {
            console.log(err);
            return false
        }
    }


    let logThis = file + "\n" + newLog

    console.log(newLog);

    try {
        fs.writeFileSync(log.filePath, logThis, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }
}