import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.mjs'
import usersRoutes from './routes/usersRoutes.mjs'

const app = express();
const PORT = process.env.port || 3000;
const DBURI = process.env.DBURI || "mongodb://localhost:27017/chatAppDB";

const TOKENEXPIRATION = 60 * 60 * 24;


dotenv.config();







const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', usersRoutes);



app.listen(PORT, async () => {
    try {
        console.log(`Running on port ${PORT}`);
        const db = await mongoose.connect(DBURI);
        // check for errors 

    } catch (error) {
        console.log(error);

    }

})





// const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
//         if (error) {
//             return res.status(401).json({ error: ' This Unauthorized' });
//         }
//         req.user = decoded;
//         next();
//     });
// }



// app.get('/api/getAllFriends', verifyToken, async (req, res) => {
//     try {
//         const user = await User.findOne({ username: req.user.username });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found!' });
//         }
//         const friendsIds = user.friendList;


//         if (!friendsIds.length) {
//             return res.status(404).json({ error: 'No friends to show' });
//         }

//         const friends = await User.find({ _id: { $in: friendsIds } });

//         if (!friends) {
//             return res.status(404).json({ error: 'No friends to show' });
//         }

//         const friendList = friends.map(user => ({
//             username: user.username,
//             userId: user._id,
//             avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]

//         }));

//         return res.status(200).json(friendList);

//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error' });

//     }
// })


// app.post('/api/findUser', verifyToken, async (req, res) => {
//     try {

//         const usersFound = await User.find({ username: { "$regex": req.body.username, "$options": "i" } });

//         if (!usersFound) {
//             return res.status(404).json({ message: 'No user exist by that username' });
//         }

//         const currentUser = await User.findOne({ username: req.user.username });
//         const filtered = usersFound.filter((user) => user._id.toString() !== currentUser._id.toString());

//         if (!filtered.length) {
//             return res.status(404).json({ message: 'No user exist by that username' });
//         }

//         const usersProcessed = filtered.map(user => {

//             return {
//                 username: user.username,
//                 userId: user._id,
//                 avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]
//             }

//         });

//         if (!usersProcessed.length) {
//             return res.status(404).json({ message: 'No user exist by that username' });
//         }

//         res.status(200).json(usersProcessed);

//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// })



// app.post('/api/addFriend', verifyToken, async (req, res) => {
//     try {
//         const addUser = await User.findOne({ _id: req.body.userId });
//         if (!addUser) {
//             return res.status(404).json({ error: 'User not found!' });
//         }

//         const updatedUser = await User.findOneAndUpdate({ username: req.user.username }, { $push: { friendList: addUser._id } });
//         // console.log(updatedUser)
//         if (!updatedUser) {
//             return res.status(404).json({ error: 'User not found!' });
//         }

//         return res.status(200).json({ message: 'User added to friends' });

//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// })




