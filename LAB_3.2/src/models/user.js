const mongoose = require("mongoose")
const valid = require("validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw  new Error("Age must be a positive number")
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,

        validate(value) {
            if (!valid.isEmail(value)) {
                throw  new Error("Email is invalid")
            }
        },

    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: {
            validator: function (value) {
                if (value.toLowerCase().includes('password')) {
                    throw  new Error("password is invalid")
                }
            },
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findOneByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw  new Error('Incorrect email!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw  new Error('Incorrect password!');
    }
    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id},'kdweueksdsjfij');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
