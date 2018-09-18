const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib');
const check = require('../libs/checkLib');
const mailer = require('./../libs/mailerLib');

const UserModel = mongoose.model('User');
const RoomModel = mongoose.model('Room');

let createChatRoom = (req, res) => {
    let createRoom = () => {
        return new Promise((resolve, reject) => {

            if (check.isEmpty(req.body.userEmail)) {
                let apiResponse = response.generate("true", "Email not found", 500, null);
                reject(apiResponse);
            } else {
                let newChatRoom = new RoomModel({
                    roomId: shortid.generate(),
                    roomName: req.body.roomName,
                });

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate("true", "Failed to find user.", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {
                        let apiResponse = response.generate("true", "chat room creation failed.", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        let owner = {}
                        owner.name = userDetails.firstName + userDetails.lastName;
                        owner.Id = userDetails.userId;
                        newChatRoom.admin = owner;
                        newChatRoom.members.push(owner);
                        userDetails.groups.push(newChatRoom.roomId);

                        newChatRoom.save((err, newChatRoom) => {
                            if (err) {
                                let apiResponse = response.generate("true", "failed to create a Room", 500, null);
                                reject(apiResponse);
                            }
                            else {
                                let data = {};
                                data.userdetails = userDetails;
                                data.newRoom = newChatRoom;
                                resolve(data);
                            }
                        });
                    }
                });
            }
        });

    }

    let saveDetails = (data) => {

        return new Promise((resolve, reject) => {

            UserModel.update({ userId: data.userdetails.userId }, { groups: data.userdetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate("true", "Failed to save user details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "unable to save user room", 500, null);
                    reject(apiResponse);
                } else {
                    resolve(data.newRoom);
                }
            });
        });
    }


    createRoom(req, res)
        .then(saveDetails)
        .then((result) => {
            let apiResponse = response.generate(false, "room saved", 200, result);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        });

}

let deleteChatRoom = (req, res) => {

    if (check.isEmpty(req.body.chatRoomId)) {
        let apiResponse = response.generate("true", "Room not found", 500, null);
        res.send(apiResponse);
    } else {

        RoomModel.remove({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
            if (err) {
                let apiResponse = response.generate("true", "Failed ", 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                let apiResponse = response.generate("true", "No room found", 500, null);
                res.send(apiResponse);
            }
            else {
                let apiResponse = response.generate(true, "Room deleted", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}

let editChatRoom = (req, res) => {
    if (check.isEmpty(req.params.chatRoomId)) {
        let apiResponse = response.generate(true, "chatRoomId?", 500, null);
        res.send(apiResponse);
    } else {
        let options = req.body;
        RoomModel.update({ roomId: req.params.chatRoomId }, options, { multi: true }, (err, roomDetails) => {

            if (err) {
                let apiResponse = response.generate(true, "Failed to edit Room", 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                let apiResponse = response.generate(true, "Room not found", 500, null);
                res.send(apiResponse);
            }
            else {
                let apiResponse = response.generate(false, "Room edited", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}//end editChatRoom

let sendInvite = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                let apiResponse = response.generate(true, "email missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "db error", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                let apiResponse = response.generate(true, "chatRoomId?", 500, null);
                reject(apiResponse);
            }
            else {

                RoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "db error", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(roomDetails)) {
                        let apiResponse = response.generate(true, "No Group Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }

    let sendMail = (details) => {

        return new Promise((reject, resolve) => {
            mailer.autoEmail(req.body.userEmail, `<a href='http://localhost:4200/joinGroup/${details.roomDetails.roomId}/${details.roomDetails.roomName}'>click here to join</a>`);
            let apiResponse = response.generate(false, "mail sent", 200,"Mail sent successfully");
            resolve(apiResponse);
        });

    }//end sendMail

    findUser(req, res)
        .then(findRoom)
        .then(sendMail)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });

}

let joinChatRoom = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                let apiResponse = response.generate(true, "Email is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
                reject(apiResponse);
            }
            else {

                RoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "db errro", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(roomDetails)) {
                        let apiResponse = response.generate(true, "No Group Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findRoom()

    let saveRoom = (details) => {

        return new Promise((resolve, reject) => {
            let user = {};
            user.name = `${details.userDetails.firstName} ${details.userDetails.lastName}`;
            user.Id = details.userDetails.userId;
            details.roomDetails.members.push(user);

            RoomModel.update({ roomId: req.body.chatRoomId }, { members: details.roomDetails.members }, { multi: true }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate("true", "Failed to save room details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    resolve(details);
                }
            });
        });
    }
    let saveUser = (details) => {

        return new Promise((resolve, reject) => {
            details.userDetails.groups.push(req.body.chatRoomId);

            UserModel.update({ email: req.body.userEmail }, { groups: details.userDetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate("true", "Failed to save user chat details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    resolve(result);
                }
            });
        });
    }

    findUser(req, res)
        .then(findRoom)
        .then(saveRoom)
        .then(saveUser)
        .then((result) => {
            let apiResponse = response.generate(false, "User & Group Saved", 200, result);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        });

}//end JoinChatRoom

let getChatRooms = (req, res) => {

    RoomModel.find({}, (err, roomsDetails) => {

        if (err) {
            let apiResponse = response.generate(true, "failed to find the Rooms", 500, null);
            res.send(apiResponse);
        }/* if company details is not found */
        else if (check.isEmpty(roomsDetails)) {
            let apiResponse = response.generate(true, "No Rooms Found", 500, null);
            res.send(apiResponse);
        }
        else {
            let apiResponse = response.generate(false, "Groups found", 200, roomsDetails);
            res.send(apiResponse);

        }

    });

}//end getChatRooms

let getChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {
        RoomModel.findOne({ roomId: req.params.chatRoomId }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                res.send(apiResponse);

            }

        });
    }

}//end getChatRoom

let closeChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {

        RoomModel.update({ roomId: req.params.chatRoomId }, { status: false }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                let apiResponse = response.generate(false, "Group found & marked close", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}//end closeChatRoom


module.exports = {
    createChatRoom: createChatRoom,
    deleteChatRoom: deleteChatRoom,
    editChatRoom: editChatRoom,
    sendInvite: sendInvite,
    getChatRoom: getChatRoom,
    getChatRooms: getChatRooms,
    joinChatRoom: joinChatRoom,
    closeChatRoom: closeChatRoom
}