function imgDetect() {
    document.querySelectorAll('*[src]').forEach(img => {
        img.onerror = () => img.src = '../assets/discord_logos/clyde/icon_clyde_blurple_RGB.png'
    })
}