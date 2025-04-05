import express from 'express';
import { verifyToken } from '../middlewares/userTokenValidator.mjs';
import * as UsersController  from '../controllers/userController.mjs';
const router = express.Router();


router.get('/getAllFriends', verifyToken, UsersController.getAllFriends);
router.post('/findUser', verifyToken, UsersController.findUserByUsername);
router.post('/addFriend', verifyToken, UsersController.addFriend);



export default router;