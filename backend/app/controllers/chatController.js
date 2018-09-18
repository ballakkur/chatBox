/**
 * module dependencies.
 */
const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const check = require('../libs/checkLib')

/* Models */
const ChatModel = mongoose.model('Chat')



let getGroupChat = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.query.chatRoomId)) {
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        })
    }

    let findChats = () => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                receiverId: req.query.chatRoomId
            }

            ChatModel.find(findQuery)
                .select('-_id -__v -receiverName -receiverId')
                .sort('-createdOn')
                .skip(parseInt(req.query.skip) || 0)
                .lean()
                .limit(10)
                .exec((err, result) => {
                    if (err) {
                        let apiResponse = response.generate(true, `error: ${err.message}`, 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'chats empty', 404, null)
                        reject(apiResponse)
                    } else {
                        resolve(result)
                    }
                })
        })
    } 

    validateParams()
        .then(findChats)
        .then((result) => {
            let apiResponse = response.generate(false, 'succefull', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            res.send(error)
        })
}    


module.exports = {
    getGroupChat: getGroupChat
}