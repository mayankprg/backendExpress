import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const UsersSchema = new Schema({
    username: String,
    password: { type: String, required: true, select: false },
    friendList: [mongoose.Schema.Types.ObjectId],
});



const Users = new mongoose.model('Users', UsersSchema);

export default Users;
