function setInputsTypes(settings, guild) {
    const allInputs = document.querySelectorAll('.form_input')
    for(let input of allInputs) {
        if(input.nodeName === "SELECT") {
            // <select ...>...</select>
            const type = input.getAttribute('data-type')
            let itemType = type.split('-')[1] || type
            if(!itemType.endsWith("s")) itemType += "s"
            let allItems = guild[itemType]
            if(type.includes('channel')) {
                const channelType = type.split('-')[0]
                if(channelType !== itemType && allItems) allItems = allItems.filter(item => item.type === channelType)
            }else if(type.includes('role')) {
                allItems = allItems.filter(r => r.manageable && !r.managed && r.name !== "@everyone")
            }
            const baseOption = document.createElement('option')
            baseOption.disabled = "true"
            baseOption.innerText = "Select your setting:"
            if(!settings[input.name]) baseOption.selected = "true"
            input.appendChild(baseOption)

            allItems.push({
                name: "unset",
                id: "",
                reset: true
            })
            for(let item of allItems) {
                const option = document.createElement('option')
                option.innerText = item.name
                option.value = item.id
                if(settings[input.name] === item.id || (typeof settings[input.name] === "object" && settings[input.name].find(id => id === item.id))) option.selected = "true"
                if(item.reset) option.classList.add('reset')
                input.appendChild(option)
            }
        }
    }
}

function finishedForm(form) {
    const saveButton = document.createElement('button')
    saveButton.type = "submit"
    saveButton.innerText = "Save"
    form.insertBefore(saveButton, form.children[0])
    form.appendChild(saveButton.cloneNode(true))
}