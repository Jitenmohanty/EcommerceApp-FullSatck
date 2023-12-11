import { Router } from "express";
import { createUser, loginUser } from "../Controllers/Auth.js";

const AuthRouter = Router();

AuthRouter.post('/signup',createUser)
          .post('/signin',loginUser)

export default AuthRouter;
