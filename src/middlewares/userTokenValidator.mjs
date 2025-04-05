
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: ' This Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}
