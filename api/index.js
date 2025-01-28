const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dbName = 'BlogApp';
const url = `mongodb://localhost:27017/${dbName}`;
const App = express();

App.use(express.json());

const pass = async () => {
    return await bcrypt.hash("user123", 10);
};

pass().then((hashedPassword) => {
    console.log("Password Hashed:", hashedPassword);
}).catch((err) => {
    console.error("Error hashing password:", err);
});


App.use(cors([{
    origin: `http://localhost:3000/`,
    credentials: true
}]));

App.listen(4000,()=>{
    console.log("Server Started and running on port 4000");
})


mongoose.connect(url)
    .then(()=>{
        console.log("Connected To MongoDb");
        console.log("Data Base Created!");
    })
    .catch((err)=>{
        console.log("Failed To Connect",err);
    });

const UserSchema= new mongoose.Schema({
    username : {type:String,required:true,unique:true},
    password : {type:String,required:true}
})
    
const User = mongoose.model('User',UserSchema);

App.post('/register', async(req,res) => {
    const {username,password} = req.body;
    console.log("consoling req body",req.body);
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:"User Already Exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newuser = new User({username,password:hashedPassword});
        await newuser.save();

        res.status(200).json({message:"User Registered"});
    }
    catch(err){
        res.status(500).json({message:"Registration Error"});
    }

})

App.post('/login', async(req,res) => {
    const {username,password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"User Not Found"});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid Password"});
        }
        res.status(200).json({message:"User Logined"});
    }
    catch(err){
        res.status(500).json({message:"Login Error"});
    }
})