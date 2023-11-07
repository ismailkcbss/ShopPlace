import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "You did not enter a user name."],
        lowercase: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "You did not enter an email address"],
        unique: true,
        validate: [validator.isEmail, "You have not logged in to the email format"]
    },
    password: {
        type: String,
        required: [true, "You have not entered a password"],
        minLength: [4, "Create a password with at least 4 characters."],
        maxLength: [20, "Maximum of 20 characters"],
    },
    phone: {
        type: Number,
        required: [true, "You did not enter your phone number"],
        minLength: [11, "Missing phone information"],
        maxLength: [11, "You made too much dialing when entering the phone number"],
    },
    image: {
        type: String,
        required: [true, "You have not uploaded a photo"]
    },
    seller:{
        type:Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    });
});


const User = mongoose.model('user', userSchema);

export default User;