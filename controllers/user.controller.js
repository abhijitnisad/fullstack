import User from "../model/User.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  // console.log("BODY:", req);

  //get data
  //validate
  //check if user already exists
  //create a user in database
  //create  a verificaiton token
  //save token in database
  //send token as email to user
  //send succcess status to user

  const { name, email, password } = req.body;
  console.log("Request body:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    // console.log("existingUser:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    // console.log("user:", user);

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;
    console.log("Generated verification token:", token);
    console.log(
      "Verification URL:",
      `${process.env.BASE_URL}/api/v1/users/verify/${token}`
    );

    await user.save();

    console.log("user1:", user);
    // console.log("user JSON:", user.toJSON());

    //send email

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // console.log("Transporter:", transporter);

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email, // list of receivers
      subject: "Verify your email ✔", // Subject line
      text: `Plaease Click on Following link:${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
      html: "<b>User verification</b>", // html body
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered :",
      error: error.message,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from URL
  // validate token
  //find user based on token
  //if not
  //set isVerified field is true
  //remove verification token
  //save
  //return response

  const { token } = req.params;
  console.log("Token:", token);
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const user = await User.findOne({ verificationToken: token });
  console.log("userToken:", user);

  if (!user) {
    return res.status(400).json({
      message: "Invalid (token)user",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    message: "user verified successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All field are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    console.log("user:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("passwordMatch:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
    //user verify(isVerified)

    //  if (!user.isVerified) {
    //    return res.status(400).json({ message: "User is not verified" });
    //  }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("test", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong at login",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};




const logoutUser = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};
const forgetPassword = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};
const resetPassword = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};
export { registerUser, verifyUser, login,getMe, logoutUser,resetPassword,forgetPassword };
