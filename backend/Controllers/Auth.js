import { User } from "../Models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../Services/common.js";

const SECRET_KEY = "SECRET_KEY";

export const createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const docs = await user.save();

        req.login(sanitizeUser(docs), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(docs), SECRET_KEY);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};
export const loginUser = async (req, res) => {
  res.json(req.user);
};

export const checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};
