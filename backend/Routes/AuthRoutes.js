import { Router } from "express";
import { checkAuth, createUser, loginUser } from "../Controllers/Auth.js";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.post('/signup',createUser)
          .post('/login',passport.authenticate('local'),loginUser)
          .get('/check',passport.authenticate('jwt'),checkAuth)

export default AuthRouter;
