import { Router } from "express";
import { checkUser, createUser, loginUser } from "../Controllers/Auth.js";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.post('/signup',createUser)
          .post('/signin',passport.authenticate('local'),loginUser)
          .get('/check',passport.authenticate('jwt'),checkUser)

export default AuthRouter;
