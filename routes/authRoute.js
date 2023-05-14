import express from 'express'
import {
  registerContorller,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
  deleteUserController,
  createCommentsController,
  getCommentsController,
  deleteCommentsController,
  blockStatusController,
  unblockStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
//router object
const router = express.Router();

//routing
//Register || Method
router.post("/register", registerContorller);

//LOGIN || POST
router.post("/login", loginController);
//Forget Password ||Post
router.post("/forgot-password", forgotPasswordController);
//test route
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//Order Status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//get all users
router.get("/get-users", getAllUsersController);

//delete users
router.delete(
  "/delete-user/:uid",
  requireSignIn,
  isAdmin,
  deleteUserController
);
//Block Status
router.put("/block-status/:uid", requireSignIn, isAdmin, blockStatusController);

//Unblock Status
router.put(
  "/unblock-status/:uid",
  requireSignIn,
  isAdmin,
  unblockStatusController
);

//get comments
router.get("/get-comments", getCommentsController);

//create comments
router.post("/comments", createCommentsController);

//Delete comments
router.delete("/delete-comments/:cid", deleteCommentsController);
export default router