import { Request, Response } from "express";
import { HTTP, FOOD } from "../utils/enums"
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import moment from "moment";
import { sendEmail, sendResetPasswordEmail } from "../utils/email";
import passwordModel from "../model/passwordModel";
import { Types } from "mongoose";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.ADMIN
    });

    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.CLIENT
    });

  const passwords = await passwordModel.create({password});
  user.allPasswords.push(new Types.ObjectId(passwords._id))
  user.save();

    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.VENDOR
    });

    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const createDispatcher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(3).toString("hex");
    const AdminCode = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      password: hashedPassword,
      AdminCode,
      token,
      status: FOOD.DISPATCHER
    });

    sendEmail(user);
    return res.status(HTTP.CREATED).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const getUser = await userModel.findOne({ token });
    if (getUser) {
      await userModel.findByIdAndUpdate(
        getUser._id,
        {
          token: "",
          verify: true,
        },
        { new: true }
      );

      return res.status(HTTP.OK).json({
        message: "user has been verified",
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "No user found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const getUser = await userModel.findOne({ email });
    if (getUser) {
      const passwordCheck = await bcrypt.compare(password, getUser.password);

      if (passwordCheck) {
        if (getUser.verify && getUser.token === "") {
          const token = jwt.sign(
            {
              id: getUser._id,
              status: getUser.status,
            },
            "justasecret",
            { expiresIn: "2d" }
          );
          return res.status(HTTP.OK).json({
            message: "user has been verified",
            data: token,
          });
        } else {
          return res.status(HTTP.BAD).json({
            message: "account hasn't been verified",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          message: "password error",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "No user found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const getUser = await userModel.findOne({ email });
    if (getUser) {
      const token = crypto.randomBytes(16).toString("hex");

      const checkUser = await userModel.findByIdAndUpdate(
        getUser._id,
        {
          token,
        },
        { new: true }
      );

      sendResetPasswordEmail(checkUser);

      return res.status(HTTP.OK).json({
        message: "An email has been sent to confirm your request",
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "No user found",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params

    const getUser = await userModel.findById(userID);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const checker:any = getUser?.allPasswords.find((el: any) => el.password === password);
        if (checker) {
              return res.status(HTTP.BAD).json({
                message: `${moment(checker.createdAt).fromNow()}`
              })
        }else{
          if (getUser) {
            if (getUser.token !== "" && getUser.verify) {
              await userModel.findByIdAndUpdate(
                getUser._id,
                {
                  password: hashedPassword,
                  token: "",
                },
                { new: true }
              );
      
              return res.status(HTTP.OK).json({
                message: "You password has been changed",
              });
            } else {
              return res.status(HTTP.BAD).json({
                message: "Please go and verify your account",
              });
            }
          } else {
            return res.status(HTTP.BAD).json({
              message: "No user found",
            });
          }
        }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const getUser = await userModel.find();
    const data = req.data;

    console.log(data);

    if (data.status === "admin") {
      return res.status(HTTP.OK).json({
        message: " user found",
        data: getUser,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "You don't have the pass for this",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};
