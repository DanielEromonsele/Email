import {HTTP} from "./enums"

export interface iError {
    name: string;
    message: string;
    status: HTTP;
  success: boolean;
}

 export interface iUser {
    email: string;
    password: string;
    token: string;
    AdminCode: string;
    verify: boolean;
    verifyToken: string;
    status: string;
  }