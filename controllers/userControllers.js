const User   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');
const JWT_SECRET = 'NEWTONSCHOOL'

const saltRounds = 10;

const signupUser = async (req, res) => {

    const {email, password, name, role} = req.body;

    const user = await User.findOne({ email });
    if(user){
        res.status(409).json({
            message: 'User with the given email already registered',
            status: 'fail'
        });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newuser = {
        name,
        email,
        password: hashedPassword,
        role
    };

    try{
        await User.create(newuser);
        res.status(200).json({
            message: 'User signed up successfully',
            status: 'success'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }

}

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ 'email':email });

    if(user){
        if(bcrypt.compareSync(password , user.password)){

            const token = jwt.sign(
                { userId: user._id },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.status(200).json({
                status: 'success',
                token
            });
        }else{
            res.status(401).json({
                message: 'Invalid password. Try again!',
                status: 'fail'
            });
        }
    }else{
        res.status(404).json({
            message: 'User with this email does not exist!',
            status: 'fail'
        });
    }

}

 const logoutUser = (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res
            .status(401)
            .json({
                message: "Authentication failed: Missing token.",
                status: "fail",
            });
    }
    try {
        jwt.verify(token, JWT_SECRET);
        res.clearCookie("token");
        return res
            .status(200)
            .json({ message: "Logged out successfully.", status: "success" });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

module.exports = { signupUser, loginUser, logoutUser };
