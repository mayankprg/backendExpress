import Users from '../models/Users.mjs';
import * as UserService from '../services/usersService.mjs';



export const findUserByUsername = async (req, res) => {
    try {
        const user = req.body.username;
        const currentUsername = req.user.username
        const users = await UserService.findUserByUsername(user, currentUsername);
        console.log(users);
        
         res.status(200).json(users);

    } catch (err) {
         res.status(500).json({ error: 'this ', err });
    }
}


export const addFriend = async (req, res) => {
    try {
        const userId = req.body.userId;
        const addeduser = UserService.addFriend(userId, req.user.username);
        if(!addeduser) {
            return res.status(404).json({ message: "Cannot add user" })    
        }

         res.status(200).json({ message: "User added to friends" })    

    } catch (error) {
         res.status(500).json({ error: 'Internal server error: ', error });
    }
}

/**
 * @async
 * @function getAllFriends
 * @description Get all friends of the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllFriends = async (req, res) => {
    try {
        const username = req.user.username;
        const friendlist = await UserService.getAllFriends(username);

        // if (friendlist) {
        //     return res.status(200).json({ error: 'No friends ' });
        // }
         res.status(200).json(friendlist);
    } catch (error) {
         res.status(500).json({ error: 'Internal server error: ', error });
    }
}