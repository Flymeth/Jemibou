// guild settings editor
async function editSRV(guild, guildContainer, event) {
    setLoading(guildContainer)
    const guildDetails = await getGuildDetails(guild.guild.id)
    
    const icon = document.querySelector('link[rel="shortcut icon"]')
    icon.href = guild.guild.icon
    
    let editor = await getTemplate('editor')
    for(let infos in guild.guild) {
        editor= editor.split('>' + infos).join(guild.guild[infos])
    }
    setLoading()

    // for string settings, you can set specific syntax to get variable value
    const vars = await getVars()
    const textInputVariables = vars.configs.settings.variables
    const variablesElement = document.createElement('div')
    variablesElement.classList.add('textVariables')
    for(let variable in textInputVariables.list) {
        const desc = textInputVariables.list[variable]
        
        const item = document.createElement('p')
        item.setAttribute('data-value', textInputVariables.start + variable + textInputVariables.end)
        item.innerText = desc
        variablesElement.appendChild(item)
    }
    
    const dashboardContainer = document.querySelector('.dashboard')
    dashboardContainer.innerHTML= editor
    setLoading(document.querySelector('form'))
    mainContent.appendChild(variablesElement)
    
    imgDetect()

    const a = document.createElement('p')
    a.addEventListener('click', () => {
        setTimeout(() => {
            a.parentElement.removeChild(a)
        }, 100);
        showGuilds()
    })
    a.innerText= "servers list"
    document.querySelector('nav').insertBefore(a, document.querySelector('nav').firstChild)

    const settings = (await getGuildSettings(guild.guild.id)).value
    // salon inchangeable depuis le dashboard
    if(settings.channel) delete settings.channel

    const form = document.querySelector('form')
    // form create
    const baseSettings = (await getVars()).settings

    const typeInputsBySetting = {
        string: "text",
        number: "number",
        boolean: "checkbox",
        object: "text" 
    }

    function getType(setting) {
        return typeof baseSettings[setting].value
    }

    function changeType(setting, element) {
        if(getType(setting) === "string") return element
        else if(getType(setting) === "boolean") return element.toString() === "true"
        else if(getType(setting) === "object") {
            if(typeof element === "object") {
                return element.join(' ')
            }else {
                if(!element) return []
                else return element.split(' ')
            }
        }
        else return element
    }

    function createElement(type) {
        const elementType = type.split('/')[0]
        const itemType = type.split('/')[1]

        const inputCheckbox = document.createElement('input')
        inputCheckbox.type = "checkbox"
        const inputNumber = document.createElement('input')
        inputNumber.type = "number"
        const inputString = document.createElement('input')
        inputString.type = "text"
        const elementByelementType = {
            string: inputString,
            text: document.createElement('textarea'),
            boolean: inputCheckbox,
            list: document.createElement('select'),
            number: inputNumber
        }
        const element = elementByelementType[elementType]
        element.setAttribute('data-type', itemType)
        element.setAttribute('data-multiple', itemType.endsWith('s'))
        if(itemType.endsWith('s')) element.setAttribute('multiple', "true")

        return element
    }
    
    for(let setting in settings) {
        const settingContainer = document.createElement('div')
        settingContainer.classList.add('setting-container')

        const settingType = getType(setting)
        const type = typeInputsBySetting[settingType]
        const hint = baseSettings[setting].desc

        const settingName = document.createElement('h3')
        settingName.innerText = setting

        const label = document.createElement('label')
        label.for = setting
        label.innerText = hint
        if(baseSettings[setting].webHint) {
            const webHint = document.createElement('span')
            webHint.classList.add('webHint')
            webHint.innerText = baseSettings[setting].webHint
            label.appendChild(webHint)
        }

        const input = createElement(baseSettings[setting].type)
        input.placeholder = "Change your setting"
        input.name = setting
        input.id = setting
        input.classList.add('form_input')
        if(baseSettings[setting].required) input.required = "true"
        if(baseSettings[setting].variables) input.setAttribute('data-variables', "true")
        
        const value = changeType(setting, settings[setting])
        if(type === "checkbox") input.checked = value
        else input.value = value

        label.append(input)

        settingContainer.appendChild(settingName)
        settingContainer.appendChild(label)

        form.insertBefore(settingContainer, form.children[form.children.length])
    }
    setInputsTypes(settings, guildDetails)
    finishedForm(form)
    setLoading()

    
    // form submit
    form.onsubmit = async (e) => {
        e.preventDefault()

        form.classList.add('saving')


        let query= {
            guildID: guild.guild.id,
            settings: {settings: {}}
        }
        form.querySelectorAll('.form_input[name]').forEach(e => {
            if(e.getAttribute('data-multiple') === "true" && e.nodeName === "SELECT") {
                var value = []
                for(let option of e.querySelectorAll('option')) {
                    if(option.selected) {
                        if(option.value === "") {
                            value = value.filter(v => v != v)
                            break
                        }
                        value.push(option.value)
                    }
                }
            }else if(e.type === "checkbox") {
                var value = changeType(e.name, e.checked)
            }else {
                var value = changeType(e.name, e.value)
            }



            query.settings.settings[e.name]= value
        })

        const success = await fetch('/save', {
            method: form.method,
            body: JSON.stringify(query)
        }).then(res=> res.json()).then(res => {
            return res.code === 200
        })

        form.classList.remove('saving')

        document.querySelectorAll('form .response').forEach(e => e.parentElement.removeChild(e))

        const responseDIV = document.createElement('div')
        const timeout = 5
        const anim = .5
        responseDIV.classList.add('response')
        responseDIV.setAttribute('data-success', success)
        responseDIV.style.setProperty('--timeout', timeout + 's')
        responseDIV.style.setProperty('--closeAnim', anim + 's')

        const successMSG = {
            true: "Your settings is now saved!",
            false: "Oups: please verify each settings parameters and re-try!"
        }

        const txt = document.createElement('p')
        txt.innerText = successMSG[success]

        const button = document.createElement('div')
        button.classList = 'cross'
        button.innerHTML = "<i class='fa fa-times'>"

        responseDIV.appendChild(txt)
        responseDIV.appendChild(button)

        form.appendChild(responseDIV)

        const tmout = setTimeout(() => {
            removeReponse()
        }, timeout*1000);

        button.onclick = () => removeReponse();

        function removeReponse() {
            responseDIV.classList.add('closed')
            clearTimeout(tmout)

            setTimeout(() => {
                responseDIV.parentElement.removeChild(responseDIV)
            }, anim*1000);
        }
    }
}