const https = require('https')
const fs = require('fs')
const serverProps = require('./configs.json')
const {variables} = serverProps
const {getSettings} = require('../../commands/settings')

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
let srv;
function setupServer(close, vars) {
    const secureOptions = {
        key: process.env.KEY || fs.readFileSync(serverProps.secures_options.key),
        cert: process.env.CERT || fs.readFileSync(serverProps.secures_options.cert)
    }

    if(close && srv) {
        return srv.close()
    }

    srv = https.createServer(secureOptions, (req,res) => {
        let url = req.url.split('/')
        url.shift()

        if(url.join('') === '') {
            url[url.length-1] = 'index'
        }

        const urlInfos = new URL('http://' + req.headers.host + "/" + url.join('/'))

        let path = urlInfos.pathname
        let extention = path.split('.')[1]
        if(!extention) {
            path+= '.' + serverProps.defaultExtention.replace('.','')
        }

        fs.readFile(serverProps.defaultHtmlPath + decodeURI(path.replace('/','')), async (err, data) => {
            if(err) {
                res.writeHead(404)
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

                        if(urlInfos.pathname === '/settings') {
                            const id = urlInfos.searchParams.get('guild')
                            if(id) {
                                const params = await getSettings(id, vars, true)
                                if(params.channelID) infos.guildSettings = JSON.stringify(params)
                            }
                        }

                        for(let v of args) {
                            let path = [...v.path]
                            let value = infos

                            while(path.length) {
                                const goTo = path.shift().replace('()', '')
                                value = value[goTo]

                                if(typeof value === "function") {
                                    try {
                                        value = await value()
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

                let accepts = req.headers.accept.split(",").find(a => a.includes(path.split('.').pop()))
                res.writeHead(200, {
                    "Content-Type": accepts || "*/*"
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

module.exports.startSrv = (vars) => setupServer(false, vars)
module.exports.stopSrv = () => setupServer(true)