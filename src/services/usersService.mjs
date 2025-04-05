import Users from '../models/Users.mjs';


 const AVATAR = [
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
    "https://randomuser.me/api/portraits/women/6.jpg",
    "https://randomuser.me/api/portraits/men/7.jpg",
    "https://randomuser.me/api/portraits/women/8.jpg"
]


// gets the current user
export const getUserByUsername = async (username) => {

    return await Users.findOne({ username: username });

}

// finds new user 
export const findUserByUsername = async (username, currentUsername) => {
  
    const usersFound = await Users.find({ username: { "$regex": username, "$options": "i" } });
    // filter if user is same as the current users
    const currentUser = await Users.findOne({ username: currentUsername });
    const filteredList = usersFound.filter((user) => user._id.toString() !== currentUser._id.toString());

    const usersProcessed = filteredList.map(user => {
        return {
            username: user.username,
            userId: user._id,
            avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]
        }
    });

    return usersProcessed;

}


export const addFriend = async (userId, currentUsername) => {

    
    const addUser = await Users.findOne({ _id: userId });

    return await Users.findOneAndUpdate(
        { username: currentUsername },
        { $addToSet: { friendList: addUser._id } }
        // { $push: { friendList: addUser._id } }
    );
}

// TODO if check for all functions 

export const getAllFriends = async (username) => {
    const currentUser = await Users.findOne({ username: username });
    
    const friendsIds = currentUser.friendList;

    if (!friendsIds.length) {
        return null;
    }
    
    const friends = await Users.find({ _id: { $in: friendsIds } });
    return friends.map(user => ({
        username: user.username,
        userId: user._id,
        avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]

    }));
}


