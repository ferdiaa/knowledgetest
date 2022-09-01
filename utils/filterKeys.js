const logger = require('../utils/logger')

const filterKeys = (object, keys) => {
    try {
        object = {...object}
        let data = {}
    
        keys.forEach(key => {
            if(object.hasOwnProperty(key)){
                data[key] = object[key]       
            }
        })
        return data        
    } catch (err) {
        throw err
    }
}

module.exports = filterKeys