const Discord = require('discord.js')
const fs = require('fs')
const configs = require('./_configs.json')
const pkg = require('./package.json')
const {log, saveLog} = require('./logs/lib')
const assets = require('./_assets.json')
const {doneMsg} = require('./tools/doneMSG')
const server = require('./web/server/server')
const {getCommands, getEvents} = require('./tools/getModules')
const mongodb = require('mongodb')

let secret;
try {
    secret = require('./_secret.json')
} catch (e) {}

const token = process.env.TOKEN || secret.discord.token

const client = new Discord.Client({
    disableMentions: "everyone"
})

client.login(token)

// mongodb (soon)

// const {mongoClient} = mongodb
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME || secret.mongodb.username}:${process.env.MONGO_PASSWORD || secret.mongodb.password}@${process.env.MONGO_CLSTURL || secret.mongodb.clr_url}`

// const mongoDB = async() => {
//     const client = new mongoClient(uri)
//     await client.connect()
// }

const vars = {
    discord: Discord,
    client,
    configs,
    settings: configs.settings.list,
    package: pkg,
    assets,
    server,
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
    setEndMessage: (message, emote, otherMessages) => doneMsg(message, vars, emote, otherMessages)
}
vars.commands = getCommands(vars)
vars.events = getEvents(vars)

// events
if(configs.active.bot) {
    for(let event of vars.events) {
        client.on(event.name, (eventElement) => {
            event.run(eventElement, vars)
        })
    }
}

// SERVER
if(configs.active.webapp) server(vars)