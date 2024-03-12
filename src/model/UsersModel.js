const mongoose = require('mongoose');

const DatabaseSchema = mongoose.Schema({
    email:{type:String,required:true,unique:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    mobile:{type:String,required:true},
    password:{type:String,required:true},
},{timestamps:true,versionKey:false});

const UsersModel = mongoose.model('Users',DatabaseSchema);
module.exports = UsersModel