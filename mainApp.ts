import { Application, NextFunction, Request, Response } from "express";
import { HTTP, mainError } from "../authLaunch/error/mainError";
import { errorHandler } from "../authLaunch/error/errorHandler";
import auth from "../authLaunch/router/userRouter";


export const mainApp = (app: Application) =>{

    try {
        app.use("/api/v1/auth", auth);

        app.get("/", (req: Request, res: Response): Response => {
            try {
                return res.status(200).json({
                    message: "Welcome To Our API"
                })
            } catch (error) {
                return res.status(404).json({
                    message: "Invalid"
                })
            }
            
        })

        app.all("", (req: Request, res: Response, next: NextFunction)=>{
            next(new mainError({
                name: "Route Error",
                message: `This endpoint you entered ${req.originalUrl}is not supported`,
                status: HTTP.BAD,
                success: false,
            }))
        })

            app.use(errorHandler);
    } catch (error) {
        return error
    }
}