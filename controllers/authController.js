import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import commentModel from "../models/commentModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerContorller = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "already Register please login",
      });
    }
    //Register User
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
      },

      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "email is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "email is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controllers
export const testController = (req, res) => {
  res.send("protected route");
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({
        error: "password is required and must be 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error while updating profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//order Status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating Order",
      error,
    });
  }
};

//all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "All Users",
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erorr in getting users",
      error: error.message,
    });
  }
};

//delete user
export const deleteUserController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.uid);
    res.status(200).send({
      success: true,
      message: "User deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting User",
      error,
    });
  }
};

//block user Status
export const blockStatusController = async (req, res) => {
  try {
    const statusBlockeduser = await userModel.findByIdAndUpdate(
      req.params.uid,
      {
        status: 0,
      },
      { new: true }
    );
    res.status(200).json({
      succes: true,
      message: "User status block successfully",
      statusBlockeduser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      messaage: "Error while blocking status",
      error,
    });
  }
};

//unblock user Status
export const unblockStatusController = async (req, res) => {
  try {
    const statusUnblockeduser = await userModel.findByIdAndUpdate(
      req.params.uid,
      {
        status: 1,
      },
      { new: true }
    );
    res.status(200).json({
      succes: true,
      message: "User status unblocked successfully",
      statusUnblockeduser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      messaage: "Error while blocking status",
      error,
    });
  }
};

//create comments
export const createCommentsController = async (req, res) => {
  try {
    const {
      email,
      phone,
      name,
      address,
      title,
      description,
      username,
      useremail,
      userphone,
    } = req.body;
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!title) {
      return res.send({ message: "address is required" });
    }

    if (!description) {
      return res.send({ message: "Description is required" });
    }
    const comments = new commentModel({
      email,
      phone,
      name,
      address,
      title,
      description,
      username,
      useremail,
      userphone,
    });
    comments.save();
    res.status(201).send({
      success: true,
      message: " Comment Sent Successfully",
      comments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in adding comments",
      error,
    });
  }
};

//get comments
export const getCommentsController = async (req, res) => {
  try {
    const comments = await commentModel.find({});
    res.status(200).send({
      success: true,
      message: "All comments",
      comments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting comments",
    });
  }
};

//delete comments
export const deleteCommentsController = async (req, res) => {
  try {
    await commentModel.findByIdAndDelete(req.params.cid);
    res.status(200).send({
      success: true,
      message: "Comments Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting Comments",
      error,
    });
  }
};