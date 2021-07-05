const Discord = require('discord.js')
const fs = require('fs')
const configs = require('./configs.json')
const pkg = require('./package.json')
const {log, saveLog} = require('./logs/lib')
const assets = require('./assets.json')
const {doneMsg} = require('./tools/doneMSG')
const server = require('./web/server')

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
    log: (message, color, type, private) => log(message, color, type, private, vars),
    saveLog: (ignoreLastest) => saveLog(ignoreLastest),
    setEndMessage: (message, emote) => doneMsg(message, vars, emote)
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
server.run()