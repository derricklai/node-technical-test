function convertISODateToAEST(isoDate, utc = false) {
    try {
        const event =  new Date(isoDate)
        const formatDate = event.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
        if(formatDate === 'Invalid Date') throw Error('Please enter a valid date')
        if (utc)
            return event
        return `${formatDate} AEST`;
    } catch(error) {
        console.log('Error:', error.message)
    }
}

module.exports = {
    convertISODateToAEST
}
