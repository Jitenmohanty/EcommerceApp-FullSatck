import { Router } from "express";
import { checkAuth, createUser, loginUser, resetPassword, resetPasswordRequest } from "../Controllers/Auth.js";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.post('/signup',createUser)
          .post('/login',passport.authenticate('local'),loginUser)
          .get('/check',passport.authenticate('jwt'),checkAuth)
          .post('/reset-password-request', resetPasswordRequest)
          .post('/reset-password',resetPassword)

export default AuthRouter;
