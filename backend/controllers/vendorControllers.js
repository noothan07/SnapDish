const Vendor = require('../models/Vendor');
const dotEnv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotEnv.config();
const secretKey = process.env.WhatIsYourKey;

const vendorRegister = async(req,res) =>{
        const{username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("email already exists!");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor ({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();

        res.status(200).json({message:"vendor registered successfully"});
        console.log("vendor registered");
        
    }catch(error){

        console.log(error);
        res.status(500).json({error:"internal server error"});

    }
}

const venderLogin = async(req,res) =>{
        const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});

        if(!vendor || !(await bcrypt.compare(password,vendor.password)))
        {
            return res.status(400).json({error:"invalid email or password"});
        }
        const token = jwt.sign({vendorId:vendor._id}, secretKey, {expiresIn:'1h'})

        res.status(200).json({message:"login successful", token});
        console.log("login successfull",email);
        console.log("token generated: ",token);
        
        
    }catch(error){
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
}

const getAllVendors = async(req,res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    } catch (error) {
        console.log("at line 63",error);
        res.status(400).json({error:"internal server error"});
    }
}

const getVendorById = async(req,res) => {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            res.status(404).json({error:"vendor not found"});
        }
        res.status(200).json({vendor});

    } catch (error) {
        console.log("at line 63",error);
        res.status(400).json({error:"internal server error"});
    }
}

module.exports = { vendorRegister , venderLogin, getAllVendors,  getVendorById }