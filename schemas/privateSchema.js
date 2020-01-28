const mongoose=require('mongoose');

const schema={
    name:{type:String,required:true},
    favorites:[String]

}

const private_schema=new mongoose.Schema(schema);
const private=mongoose.model('Private',private_schema);

module.exports=private;