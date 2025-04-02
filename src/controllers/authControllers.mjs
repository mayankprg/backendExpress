import Users from '../models/Users.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



const signup = async (req, res) => {
    try {
        // Check if already exists 
        const existingUser = await Users.findOne({ username: req.body.username })
        if (existingUser) {
            return res.status(400, { error: 'Username Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new Users({
            username: req.body.username,
            password: hashedPassword
        })

        await newUser.save();

        const token = jwt.sign(
            { username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: TOKENEXPIRATION }
        );
        return res.status(201).json({
            token: token,
            expiresIn: TOKENEXPIRATION
        });

    } catch (err) {
        return res.status(500, { error: 'Internal Server Error', err });
    }
}


const login = async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.body.username }).select("+password");
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: TOKENEXPIRATION }
        );
        return res.status(200).json({
            username: user.username,
            userId: user._id,
            token: token,
            expiresIn: TOKENEXPIRATION
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', err });
    }
}

// add logout

module.exports = { signup, login }