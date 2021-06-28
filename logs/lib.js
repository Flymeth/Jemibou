const fs = require('fs')
const { log, channels } = require('../configs.json')

/**
 * Log a message on a discord channel, on a log file and on the console
 * @param {String} message Your log message
 * @param {String} color Your embed color
 * @param {String} type The type of your log
 * @param {Boolean} private if the log is private
 * @returns {Boolean} true if opperation success, false if not
 */
module.exports.log = async (message, color, type, private, vars) => {
    if(!log.active || !message) return false
    
    try {
        var file = fs.readFileSync(log.lastestPath, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    let newLog = message
    let typeLog = newLog

    if(type) {
        typeLog = "(" + type + ") " + newLog
    }

    if(log.logDate) {
        let date = new Date()
        let dateMsg = `[${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} (${date.getHours()}:${date.getMinutes()}'' ${date.getSeconds()}.${date.getMilliseconds()})]`
        
        newLog = dateMsg + "=> " + typeLog
    }

    try {
        console.log(newLog);
    } catch (err) {}
    
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
        .setColor(color || log.embedColor || "RANDOM")
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
 * @returns {Boolean} true if opperation success, false if not
 */
module.exports.saveLog = () => {
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
        var existFile = fs.readFileSync(filePath, {encoding: "utf-8"})
    } catch (err) {}

    if(existFile) logContent = existFile + "\n" + logContent

    try {
        fs.writeFileSync(filePath, logContent, {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    try {
        fs.writeFileSync(log.lastestPath, "", {encoding: "utf-8"})
    } catch (err) {
        console.log(err);
        return false
    }

    console.log("log saved");

    return true
}