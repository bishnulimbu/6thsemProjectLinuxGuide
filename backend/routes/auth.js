const express = require("express");
const router = express.Router();
const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/signup", authMiddleware, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Validate role if for normla user.
  try{
    const existingUser = await User.findOne({where:{username}});
    if(existingUser){
      return res.status(400).json({error:"Username already exists."});
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "user", // Set the role for the new user
    });
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
      res.status(500).json({ error: "Falied to create User." });
  }
});

router.post("/admin/l=signup",authMiddleware,requiredRole(["super_admin"]),async(req,res)=>{
  const {username,password,role}= req.body;
  if(!username || !password ||! role){
    return res.status(400).({error:"Username, password and role is required."});
  }
  if(!["superadmin","admin","user"].includes(role)){
    return res.status(400).json({error:"invalid role"});
  }
  try{
    const existingUser = await User.findOne({where:username});
    if(existingUser){
      return res.status(400).json({error:"Username already exists."});
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
    const user = await User.create({
      username,
      password:hashedPassword,
      role,
    })
  res.send(201).json({message:"user created successfullye", userId:user.id});
  }catch(err){
    res.status(500).json({error:"failed to create user"});
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
