const bcrypt = require('bcrypt')
const { Schema, model } = require('mongoose')
const {LocationSchema} = require('./Location') 

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
    locations: [{type: LocationSchema}]
}, { strict: true })

schema.statics.authenticate = function (email, password, cb) {
    User.findOne({ email }, {}, (err, found) => {
        if (err)
            return cb(err)

        bcrypt.compare(password, found.password, (err, same) => {
            if (same)
                cb(null, found)
            else
                cb("Could not authenticate user.")
        })
    })
}

schema.statics.register = function (email, password, cb) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            const toInsert = new User()
            toInsert.email = email
            toInsert.password = hash
            toInsert.save(cb)
        });
    });
}

const User = model('User', schema)
module.exports = User