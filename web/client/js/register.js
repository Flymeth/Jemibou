async function register() {
    console.log("TOKEN INVALID: RECONNECT TO DISCORD");

    const temp = await getTemplate("login");
    mainContent.innerHTML = temp;

    setupConnection()
}



function setupConnection() {
    const redirect = window.location.protocol + "//" + window.location.hostname + window.location.pathname;

    document.querySelector(".connect").addEventListener("click", () => {
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=859139199172083713&redirect_uri=${encodeURI(redirect)}&response_type=token&scope=identify%20guilds`;
    });
}