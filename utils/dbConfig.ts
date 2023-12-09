import {connect} from "mongoose"
import env from "dotenv"
env.config()

// const DATABASE_URL = "mongodb+srv://danieleromonsele01:Lifeofaking@cluster0.x5syb88.mongodb.net/auth?retryWrites=true&w=majority"
const DATABASE_URL = "mongodb://localhost:27017/test"

export const dbConfig = async() => {
  try {
    await connect(DATABASE_URL).then(() => {
      console.log("DB connected...!");
    });
  } catch (error) {
    return error;
  }
};
