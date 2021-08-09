const Discord = require('discord.js')
const fs = require('fs')
const configs = require('./_configs.json')
const pkg = require('./package.json')
const {log, saveLog} = require('./logs/lib')
const assets = require('./_assets.json')
const {doneMsg} = require('./tools/doneMSG')
const server = require('./web/server/server')

const token = process.env.TOKEN || require('./token.json').token

const client = new Discord.Client({})

client.login(token)

const vars = {
    discord: Discord,
    client: client,
    configs: configs,
    settings: configs.settings.list,
    package: pkg,
    assets: assets,
    server: server,
    /**
     * The logger system
     * @param {String} message The message to log
     * @param {String} color The color of the embed to log
     * @param {String} type The type of log
     * @param {Boolean} private If yes or no the bot need to send an embed to the log discord channel (default: no)
     * @returns {Boolean} True if the log succefull logged, false else
     */
    log: (message, color, type, private) => log(message, color, type, private, vars),
    saveLog: (ignoreLastest) => saveLog(ignoreLastest),
    /**
     * Set a specific message as the lastest message of a command
     * @param {Object} message The message to delete
     * @param {String} emote The emoji reaction
     * @param {Array} otherMessages Other messages to delete
     * @returns {Boolean} True: succefull, else False
     */
    setEndMessage: (message, emote, otherMessages) => doneMsg(message, vars, emote, otherMessages),
    commands: []
}
module.exports.getBotInformations = () => {return vars}

// commands
try {
    var commands = fs.readdirSync(configs.commandsPath)
} catch (e) {
    vars.log(e)
}
for(let cmd of commands) {
    if(!cmd.endsWith(".js") || cmd.startsWith('_')) continue
    const mdl = require(configs.commandsPath + cmd)
    if(mdl.active) vars.commands.push(mdl)
}

// events
try {
    var events = fs.readdirSync(configs.eventsPath)
} catch (e) {
    vars.log(e);
}

for(let event of events) {
    if(!event.endsWith('.js')) continue
    let eventName = event.replace('.js','')

    client.on(eventName, async (eventElement) => {
        try {
            let evt = require(configs.eventsPath + event)
            if(evt.active) {
                evt.run(eventElement, vars)
            }
        } catch (e) {
            vars.log(e);
        }
    })
}

// SERVER
server.startSrv(vars)