import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true
    },
    massages: [MessageSchema]
}, {
    timestamps: true
})

// export UserModel (if not created) or use existing UserModel
const UserModel = mongoose.model("User", UserSchema) || mongoose.models.User;
export default UserModel;