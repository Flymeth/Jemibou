function clickEvent() {
    // For each elements with class "clickEvent":
    document.querySelectorAll(".clickEvent[data-type=normal]").forEach(el => {
                
        // Add them a click event:
        el.addEventListener('click', (e) => {
            const queryAddClass = el.getAttribute('data-classTo').split(' ').join('').split(',')
    
            if(!queryAddClass) return
            queryAddClass.forEach(query => {
                document.querySelectorAll(query).forEach(q => q.classList.add('clicked'))
            })
        })
    })

    document.querySelectorAll(".clickEvent[data-type=toggle]").forEach(el => {
                
        // Add them a click event:
        el.addEventListener('click', (e) => {
            const queryAddClass = el.getAttribute('data-classTo').split(' ').join('').split(',')
    
            if(!queryAddClass) return
            queryAddClass.forEach(query => {
                document.querySelectorAll(query).forEach(q => q.classList.toggle('clicked'))
            })
        })
    })

    document.querySelectorAll(".clickEvent[data-type=remove]").forEach(el => {
                
        // Add them a click event:
        el.addEventListener('click', (e) => {
            const queryAddClass = el.getAttribute('data-classTo').split(' ').join('').split(',')
    
            if(!queryAddClass) return
            queryAddClass.forEach(query => {
                document.querySelectorAll(query).forEach(q => q.classList.remove('clicked'))
            })
        })
    })
}
window.addEventListener('load', clickEvent)