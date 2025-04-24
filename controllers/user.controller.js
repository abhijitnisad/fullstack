import User from "../model/User.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

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
    console.log("existingUser:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    console.log("user:", user);

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log("Token:", token);

    user.verificationToken = token;

    await user.save();

    console.log("user:", user);
    console.log("user JSON:", user.toJSON());

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

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Verify your email ✔", // Subject line
      text: `Plaease Click on Following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
      html: "<b>Hello world?</b>", // html body
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

  if (!user) {
    return res.status(400).json({
      message: "Invalid (token)user",
    });
  }

  user.isVerified = true;

  user.verificationToken = undefined;

  await user.save();
};

export { registerUser, verifyUser };
