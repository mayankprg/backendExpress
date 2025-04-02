import express, { application } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
const PORT = process.env.port || 3000;
const DBURI = process.env.DBURI || "mongodb://localhost:27017/chatAppDB";

const TOKENEXPIRATION = 60 * 60 * 24;

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



async function client() {
    await mongoose.connect(DBURI);
}

client().catch(err => console.log(err))

const userSchema = new mongoose.Schema({
    username: String,
    password: { type: String, required: true, select: false },
    friendList: [mongoose.Schema.Types.ObjectId],

})


const User = new mongoose.model('User', userSchema);

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));




const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];


    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, 'secret', (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: ' This Unauthorized' });
        }

        req.user = decoded;
        next();
    });
}



app.post('/api/auth/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) {
            return res.status(400, { error: 'Username Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        })

        await newUser.save();

        const token = jwt.sign({ username: newUser.username }, 'secret', { expiresIn: TOKENEXPIRATION });
        return res.status(201).json({
            token: token,
            expiresIn: TOKENEXPIRATION
        });

    } catch (err) {

        return res.status(500, { error: 'Internal Server Error' });
    }

})



app.post('/api/auth/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).select("+password");
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: TOKENEXPIRATION });
        return res.status(200).json({
            username: user.username,
            userId: user._id,
            token: token,
            expiresIn: TOKENEXPIRATION
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

}

)


app.get('/api/getAllFriends', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const friendsIds = user.friendList;


        if (!friendsIds.length) {
            return res.status(404).json({ error: 'No friends to show' });
        }

        const friends = await User.find({ _id: { $in: friendsIds } });

        if (!friends) {
            return res.status(404).json({ error: 'No friends to show' });
        }

        const friendList = friends.map(user => ({
            username: user.username,
            userId: user._id,
            avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]

        }));

        return res.status(200).json(friendList);

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });

    }
})


app.post('/api/findUser', verifyToken, async (req, res) => {
    try {

        const usersFound = await User.find({ username: { "$regex": req.body.username, "$options": "i" } });

        if (!usersFound) {
            return res.status(404).json({ message: 'No user exist by that username' });
        }

        const currentUser = await User.findOne({ username: req.user.username });
        const filtered = usersFound.filter((user) => user._id.toString() !== currentUser._id.toString())

        if (!filtered.length) {
            return res.status(404).json({ message: 'No user exist by that username' });
        }

        const usersProcessed = usersFound.map(user => {

            return {
                username: user.username,
                userId: user._id,
                avatar: AVATAR[Math.floor(Math.random() * AVATAR.length)]
            }

        });

        if (!usersProcessed.length) {
            return res.status(404).json({ message: 'No user exist by that username' });
        }

        res.status(200).json(usersProcessed);

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})



app.post('/api/addFriend', verifyToken, async (req, res) => {
    try {
        const addUser = await User.findOne({ _id: req.body.userId });
        if (!addUser) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const updatedUser = await User.findOneAndUpdate({ username: req.user.username }, { $push: { friendList: addUser._id } });
        // console.log(updatedUser)
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found!' });
        }

        return res.status(200).json({ message: 'User added to friends' });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


app.get('/api/test', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        return res.status(200).json({ username: user.username });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);

})


// change in file structure 

// import authRoutes from './routes/authRoutes.mjs'

// app.use('/api/auth', authRoutes)