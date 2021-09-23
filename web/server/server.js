const https = require('http')
const fs = require('fs')
const serverProps = require('./configs.json')
const {variables} = serverProps
const {getSettings} = require('../../commands/settings')
const stringify = require('json-stringify-safe')
const awaitEvents = require('../../tools/awaitEvents')

let url404 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ERROR</title>

    <style>
        *,::before,::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: rgb(46, 46, 46);
            color: rgb(245, 245, 245);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 1.3em;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100vh;
        }

        pre {
            margin: 15pt 0;
            padding: 5pt;
            color: rgb(46, 46, 46);
            background-color: rgb(245, 245, 245);
            max-width: 75%;
            min-width: 25%;
            font-size: 0.6em;
            border-radius: 2.5pt;
            overflow-x: scroll;
            font-family: 'Consolas', monospace;
        }
        pre::-webkit-scrollbar {
            display: none;
        }

        a {
            color: inherit;
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Hey!</h1>
    <p>I don't know what did you do but you made an error:</p>
    <pre>{{ err }}</pre>

    <a href="/">back to home</a>
</body>
</html>
`

module.exports = function setupServer(vars) {
    const secureOptions = {
        key: process.env.KEY || fs.readFileSync(serverProps.secures_options.key),
        cert: process.env.CERT || fs.readFileSync(serverProps.secures_options.cert)
    }

    // modules
    const modulesList = fs.readdirSync('./web/server/' + serverProps.modules_folder)
    const modules = []
    for(let m of modulesList) {
        if(!m.endsWith('.js')) continue

        try {
            var el = require(serverProps.modules_folder + m.replace('.js',''))
        } catch (e) {
            console.log(e);
            continue
        }

        if(el && el.active) {
            modules.push(el)
            console.log("(server): url " + el.url + " is now set as a module!");
        }
    }

    const srv = https.createServer(secureOptions, async (req, res) => {
        let url = req.url.split('/')
        url.shift()

        if(url.join('') === '') {
            url[url.length-1] = 'index'
        }

        let datas = ""
        if(req.method === "POST") {
            req.on('data', chunk => {
                datas+=chunk.toString()
            })
            await awaitEvents.await(req, 'end')
        }

        const urlInfos = new URL('http://' + req.headers.host + "/" + url.join('/'))

        let path = urlInfos.pathname
        let extention = path.split('.')[1]
        if(!extention) {
            path+= '.' + serverProps.defaultExtention.replace('.','')
        }

        // chercher si l'url est un module (et si c'est le cas l'executer)
        const module = modules.find(m => m.url === urlInfos.pathname && m.method === req.method)
        if(module) {
            const response = {
                request: module.url,
                method: req.method,
                value: await module.value(vars, urlInfos, datas)
            }
            if(response.value !== undefined) {
                res.writeHead(200, {
                    "Content-Type": "text/json; charset=UTF-8"
                })
                response.code = 200
            }else {
                res.writeHead(500, {
                    "Content-Type": "text/json; charset=UTF-8"
                })
                response.code = 500
                response.message = "error server"
            }

            return res.end(stringify(response))
        }


        fs.readFile(serverProps.defaultHtmlPath + decodeURI(path.replace('/','')), async (err, data) => {
            if(err) {
                res.writeHead(404, {
                    "Content-Type": "*/*; charset=UTF-8"
                })
                if(serverProps["404File"] == null || !serverProps["404File"]) {
                    res.write(url404.replace('{{ err }}', err))
                }else {
                    fs.readFile(serverProps["404File"], 'utf-8', (readErr, fileData) => {
                        if(readErr) {
                            res.write(url404.replace('{{ err }}', readErr))
                        }else {
                            res.write(fileData.replace('{{ err }}', err))
                        }
                    })
                }
            }else {

                const canUseVars = req.headers.accept?.includes("text")
                if(canUseVars) {
                    data = data.toString()
                    
                    let args = []
                    for(let argument of data.split(variables.prefix)) {
                        let v = argument.slice(0, argument.indexOf(variables.suffix))
                        if(!v || v.includes(" ")) continue
                        args.push({
                            path: v.split('.')
                        })
                    }

                    if(args) {
                        var infos = {...vars}

                        infos.changelog = fs.readFileSync('./changelog.md').toString().split('---').find(txt => txt.includes(vars.package.version)).split('`').join(Infinity)
                        
                        for(let v of args) {
                            let path = [...v.path]
                            let value = infos
                            
                            while(path.length) {
                                const goTo = path.shift().replace('()', '')
                                value = value[goTo]
                                
                                if(typeof value === "function") {
                                    try {
                                        value = await value.call()
                                    } catch (err) {
                                        value = undefined
                                        break
                                    }
                                }
                                if(!value) break
                            }
                            
                            if(!value) v.value = "undefined"
                            else {
                                if(typeof value === "object") v.value = JSON.stringify(value)
                                else v.value = value
                            }
                            
                            const needSplit = variables.prefix + v.path.join('.') + variables.suffix
                            data = data.split(needSplit).join(v.value)
                        }
                    }
                }

                let accepts = req.headers.accept?.split(",").find(a => a.includes(path.split('.').pop()))
                res.writeHead(200, {
                    "Content-Type": (accepts || "*/*") + "; charset=UTF-8"
                })

                res.write(data)
            }
            res.end()

        })
    }).listen(process.env.PORT || serverProps.port).on('listening', () => {
        console.log(`server listening on port ${srv.address().port} !`);
        console.info('go to: %clocalhost:'+srv.address().port, 'color: cyan;')
    })
}