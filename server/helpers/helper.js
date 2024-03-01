const nodemailer =require("nodemailer");

const sendOTPByEmail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Recovery OTP',
        text: `Your OTP for password recovery is:` +otp.toString(),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};
const otpArray = [];
const generateOTP = () => {
    const length = 6; // Length of the OTP
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to include in the OTP
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        otp += charset[randomIndex];
    }
    return otp
};

module.exports={generateOTP,sendOTPByEmail};