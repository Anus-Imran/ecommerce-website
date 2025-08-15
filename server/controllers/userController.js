import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken"



// ===========================================================

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// ==============================================================

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id);
            res.json({ success: true, token });

        } else {

            res.json({ success: false, message: "Invalid Credentials" })

        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

//Route for user registration

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //checking user already exists or not

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format & strong password

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // strong password regex: min 8 chars, 1 uppercase, 1 number, 1 special char

        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
            });
        }

        // hashing user password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// Route for admin login

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET);

            return res.json({ success: true, token });

        } else {

            return res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for getting user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // This will come from auth middleware
        
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile };