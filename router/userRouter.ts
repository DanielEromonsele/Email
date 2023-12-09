import { Router } from "express";
import {
  changeUserPassword,
  createClient,
  getAllUsers,
  resetUserPassword,
  signinUser,
  verifyUser,
} from "../controller/userController";
import validator from "../utils/validator";
import { passwordValidator, registerValidator } from "../utils/entryValidator";
import { authorization } from "../utils/authorization";

const router: Router = Router();
router.route("/register-user").post(validator(registerValidator), createClient);
router.route("/sign-in-user").post(signinUser);

router.route("/all-users").get(authorization, getAllUsers);

router.route("/verify-user").patch(verifyUser);

router.route("/reset-user-password").patch(resetUserPassword);
router
  .route("/change-user-password/:userID")
  .patch(validator(passwordValidator), changeUserPassword);
export default router;
