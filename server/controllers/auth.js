const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client');
const {sendOTPByEmail, generateOTP, verifyOTP} = require("../helpers/helper");
const prisma = new PrismaClient();
const register = async (userData) => {
    const { username, email, password, role } = userData;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role,
                otp:'',
            },
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'User does not exist.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const recovery = async (req, res) => {
    const { email } = req.body;
    let otp;
    try {
        otp = generateOTP();
        const updateData = { otp };
        const update = await prisma.user.update({
            where: { email: email },
            data: updateData,
        });
        await sendOTPByEmail(email, otp);
        res.status(200).json({message: `Great! We send you OTP`})
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
}

const reset=async (req,res)=>{
    try {
    const {email,otp,newPassword}=req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const password=hashedPassword;
        const updateData = {password };
        const findOtp=await prisma.user.findUnique({
            where: { otp: otp,email:email},
        })
        if(findOtp) {
            const updatePassword = await prisma.user.update({
                where: {email: email},
                data: updateData,
            })
            res.status(200).json({message: `Great! Try to login with new password`})
        }
    }
    catch (error){
        console.error(error);
        res.status(500).json({ error: "Could not update" });
    }
}
module.exports = { login, register ,recovery,reset};
