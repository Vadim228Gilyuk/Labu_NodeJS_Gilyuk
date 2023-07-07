const mongoose = require("mongoose")
const valid = require("validator")

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
        trim:true,

        validate(value) {
            if (!valid.isEmail(value)) {
                throw  new Error("Email is invalid")
            }
        },

    },
    password: {
        type:String,
        required: true,
        minlength:7,
        trim: true,
        validate: {
            validator: function (value) {
                if(value.toLowerCase().includes('password')){
                    throw  new Error("password is invalid")
                }
            },
        }

    }
})

const User = mongoose.model("User", userSchema)

module.exports = User