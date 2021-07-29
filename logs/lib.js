const fs = require('fs')
const { log, channels } = require('../_configs.json')

/**
 * Log a message on a discord channel, on a log file and on the console
 * @param {String} message Your log message
 * @param {String} color Your embed color
 * @param {String} type The type of your log
 * @param {Boolean} private if the log is private
 * @returns {Boolean} true if opperation success, false if not
 */
module.exports.log = async (message, color, type, private, vars) => {
    if(!message) return false
    
    try {
        var file = fs.readFileSync(log.lastestPath, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    let newLog = '"' + message + '"' 
    let typeLog = newLog

    if(type) {
        typeLog = '"' + type.toUpperCase() + "\" - " + newLog
    }

    if(log.logDate) {
        let date = new Date()
        let dateMsg = `"${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()},${date.getMilliseconds()}"`
        
        newLog = dateMsg + " - " + typeLog
    }

    try {
        console.log(newLog);
    } catch (err) {}

    if(!log.active) return true
    
    let logThis = file ? file + "\n" + newLog : newLog
    
    try {
        fs.writeFileSync(log.lastestPath, logThis, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    if(!private) {
        const embed = new vars.discord.MessageEmbed()
    
        .setDescription(typeLog)
        .setColor(color || log.embedColor || log.embedColor || "RANDOM")
        .setTimestamp()
    
        try {
            for(let channel of channels.logs) {
                let c = vars.client.channels.cache.get(channel)
                if(!c || !c.isText()) continue
                await c.send(embed)
            }
        } catch (err) {
            console.log(err);
            return false
        }
    }

    return true
}


/**
 * Save the lasted.log to a <date>.log, then clear lastest.log
 * @param {Boolean} ignoreLastest If true, it willn't delete the lastest.log file content
 * @returns {Boolean} true if opperation success, false if not
 */
module.exports.saveLog = (ignoreLastest) => {
    try {
        var logContent = fs.readFileSync(log.lastestPath, {encoding: "utf-8"})
        var date = fs.statSync(log.lastestPath).mtime
    } catch (err) {
        console.log(err);
        return false
    }

    if(!logContent || !date) return false

    let fileName = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} - ${date.getHours()}h${date.getMinutes()}m ${date.getSeconds()}s`

    let filePath = log.savedPath + fileName + ".log"

    try {
        fs.writeFileSync(filePath, logContent, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    if(!ignoreLastest) {
        try {
            fs.writeFileSync(log.lastestPath, "", {encoding: "utf-8"})
        } catch (err) {
            console.log(err);
            return false
        }
    }

    console.log("log saved");

    return true
}