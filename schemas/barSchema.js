const mongoose=require('mongoose');


const supply=new mongoose.Schema({
    name:{type:String,required:true},
    bottles:{type:Number,required:true}
});




const schema={
    name:{type:String,required:true},
    nameOfAdmin:{type:String,required:true},
    passOfAdmin:{type:String,required:true},
    emailOfAdmin:{type:String,required:true},
    stock:[supply]
    
};

const bar_schema=new mongoose.Schema(schema);
const bar=mongoose.model('Bar',bar_schema);

module.exports=bar;