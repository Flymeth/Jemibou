module.exports = {
    url: '/getVars',
    method: "GET",
    active: true,

    value: (vars, url, chuncks) => {
        const newVars = {...vars}
        if(url.searchParams.get('users') === null) delete newVars.client.users
        return newVars
    }
}