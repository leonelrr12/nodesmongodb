const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};


//Cuando haya problemas de compilacion del modelo porque ya exoste una imagen anterior o en memoria
var User;
if(mongoose.models.User){
    User = mongoose.model('User')
} else {
    User = mongoose.model('User', UserSchema)
}

module.exports = User;
//module.exports = mongoose.model('User', UserSchema)
