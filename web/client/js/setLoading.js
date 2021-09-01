const timeoutDelay = 15
function setLoading(e) {
    if(!e) {
        document.querySelectorAll('.loader').forEach(l => {
            l.parentElement.removeChild(l)
        })
    }else {
        e.innerHTML = `
        <div class="loader">
            <div class="point1"></div>
            <div class="point2"></div>
            <div class="point3"></div>
        </div>`

        document.querySelectorAll('.loading').forEach(e => setLoadingTimeout(e))
    }
}

function setLoadingTimeout(e) {
    setTimeout(() => {
        e.classList.add('timeout')
    }, timeoutDelay*1000);
}