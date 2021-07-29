const http = require('http')
const fs = require('fs')
const serverProps = require('./configs.json')

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

function setupServer(close) {
    const secureOptions = {
        key: fs.readFileSync(serverProps.secures_options.prvtKey).toString(),
        cert: fs.readFileSync(serverProps.secures_options.cert).toString()
    }

    if(close && srv) {
        return srv.close()
    }

    var srv = http.createServer(secureOptions, (req,res) => {
        let url = req.url.split('/')
        url.shift()

        if(url.join('') === '') {
            url[url.length-1] = 'index'
        }

        let extention = url[url.length-1].split('.')[1]
        if(!extention) {
            url[url.length-1] = url[url.length-1] + '.' + serverProps.defaultExtention.replace('.','')
        }
        
        fs.readFile(serverProps.defaultPath + url.join('/'), (err, data) => {
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
                res.writeHead(200)
                res.write(data)
            }
            res.end()
        })
    }).listen(serverProps.port).on('listening', () => {
        console.log(`server listening on port ${srv.address().port} !`);
        console.info('go to: %clocalhost:'+srv.address().port, 'color: cyan;')
    })
}

module.exports.startSrv = () => setupServer()
module.exports.stopSrv = () => setupServer(true)