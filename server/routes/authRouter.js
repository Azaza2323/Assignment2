const express =require("express");
const { login, register, recovery, reset } = require("../controllers/auth.js");


const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", (req, res) => {
    register(req.body)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(500).json({ error: error.message }));
});
authRouter.post("/otp",recovery)
authRouter.post("/reset",reset)
module.exports=authRouter;
