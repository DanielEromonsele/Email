import { Document, Schema, model } from "mongoose";
import { iPassword } from "../utils/interface";


interface iPasswordData extends iPassword, Document {}

const passwordModel = new Schema<iPasswordData>(
    {
      password: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  export default model<iPasswordData>("password", passwordModel);
  