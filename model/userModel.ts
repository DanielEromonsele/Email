import { Document, Schema, Types, model } from "mongoose";
import {iUser} from "../utils/interface"


interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },

    token: {
      type: String,
    },

    AdminCode: {
      type: String,
      unique: true
    },

    status: {
      type: String,
      default: "food",
    },

    verifyToken: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    allPasswords: [{
      type: Types.ObjectId,
      ref: "passwords",
    }]
  },
  { timestamps: true }
);

export default model<iUserData>("users", userModel);
