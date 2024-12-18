const express = require("express");
const User =require('../models/User')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router=express.Router();
const multer=require('multer');

//admin secret key
const ADMIN_SECRET_KEY="123";


const storage = multer.diskStorage({
     destination: function (req, file, cb) { 
        cb(null, 'uploads/'); 
    },
      filename: function (req, file, cb){ 
    cb(null, Date.now() + '-' + file.originalname);
 }
});

const upload=multer({storage:storage});

router.post("/register", upload.single('image'), async (req, res) => {
    const { email, password, role, name, secretKey, registernumber , batch, department, domain,college , dob } = req.body;
    const imageUrl=req.file?`/uploads/${req.file.filename}`:'';

    if (!email || !password || !role  ||!name) {
        return res.status(400).send("All fields are required");
    }

    try {
        if(role==="admin"){
            if(!secretKey||secretKey.trim()!== ADMIN_SECRET_KEY){
                console.log(secretKey);
                return res.status(403).send("invalid key"); 
                   
            }
        }else if(role==="anchor"){
            if(!email || !password || !name ||!batch){
                return res.status(400).send("credential are  not entered")
            }
        }else if(role==="student"){
            if(!email || !password || !name || !dob || !department || !college ||!batch){
                return res.status(400).send("credential are  not entered")
            }
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({ email, password: hashedPassword, name, role, department, registernumber, dob, college, batch,imageUrl,});
        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (err) {
        res.status(500).send("Error registering user"+ err.message);
    }
});
// Login endpoint
router.post("/login/:role", async (req, res) => {
    const { role}=req.params;
    const { email, password} = req.body;
    console.log(role,email,password);
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    try {
        const user = await User.findOne({ email });
        if (!user|| user.role!==role) {
            return res.status(400).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res. status(400).send("Invalid credentials");
        }

        const token = jwt.sign({ id: user._id, role : user.role ,batch:user.batch}, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({message:"login successfull",token});
    } catch (err) {
        res.status(500).send("Error logging in");
    }
});


/* router.post('/verify-secret-key',async (req,res)=>{
    const {email,secretKey}=req.body;
    if(secretKey!=ADMIN_SECRET_KEY){
        
        res.status(500).send('Error rng password');
    }else{
        res.send("success");
    }
});
 */

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(decoded.id);
      
    if (!user) return res.status(404).send('User not found');

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.send('Password has been reset');
  } catch (error) {
    res.status(500).send('Error resetting password');
  }
});

module.exports = router;


