const mongoose=require('mongoose');

const schema={
    name:{type:String,required:true},
    pass:{type:String,required:true},
    title:{type:String,required:true}

}

const employee_schema=new mongoose.Schema(schema);
const employee=mongoose.model('Employee',employee_schema);

module.exports=employee;