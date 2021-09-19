/**
 * Stop your executing code until an event emitted. Don't forget to use this function in a asyn function and to place "await" it
 * @param {Object} handler The event handler
 * @param {String} eventName The event name
 * @returns The event object if there isn't any error, false (boolean) else
 */
async function await(handler, eventName) {
    if(!eventName 
        || typeof eventName !== "string"
        || typeof handler !== "object"
    ) return false
    try {
        return new Promise(res => handler.once(eventName, res))
    } catch (e) {
        return false
    }
}
module.exports = {
    await
}