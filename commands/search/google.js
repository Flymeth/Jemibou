const search = require('general-search-engine')
module.exports.search = async (query) => {
    const result = await new search.search().setQuery(query).setType("search").setOptions({language: 'en'}).run().catch(e => {
        return undefined
    })
    return result
}