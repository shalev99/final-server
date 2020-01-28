const mongoose=require('mongoose');

const schema={
    name:{type:String,required:true},
    ingredients:{type:[String],required:true},
    tags:{type:[String],required:true},
    price:{type:Number,required:true}

}

const cocktail_schema=new mongoose.Schema(schema);
const Cocktail=mongoose.model('Cocktail',cocktail_schema);

module.exports=Cocktail;