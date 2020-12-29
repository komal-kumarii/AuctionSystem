const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema= new Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})

module.exports =item = mongoose.model('bidders',itemSchema)