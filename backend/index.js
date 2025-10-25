import express from "express";
import dotenv from 'dotenv'
dotenv.config();
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy } from "passport-jwt";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Productrouter from "./Routes/ProductRoute.js";
import Brandrouter from "./Routes/BrandRoute.js";
import Categoryrouter from "./Routes/CategoryRoute.js";
import UserRouter from "./Routes/UserRoutes.js";
import AuthRouter from "./Routes/AuthRoutes.js";
import CartRouter from "./Routes/CartRoutes.js";
import OrderRouter from "./Routes/OrderRoute.js";
import { cookieExtractor, isAuth, sanitizeUser, sendMail } from "./Services/common.js";
import { User } from "./Models/User.js";

import stripeModule from 'stripe';
import { Order } from "./Models/Order.js";

const stripe = stripeModule(process.env.STRIPE_SERVER_KEY);

// Stripe Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({ paymentIntentSucceeded });
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus = 'received';
      await order.save();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

// ✅ Allow only localhost:3000 (your Next.js frontend)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend running perfectly fine!" });
});

app.use("/users", isAuth(), UserRouter);
app.use("/auth", AuthRouter);
app.use("/products", isAuth(), Productrouter);
app.use("/brands", isAuth(), Brandrouter);
app.use("/categories", isAuth(), Categoryrouter);
app.use("/cart", isAuth(), CartRouter);
app.use("/orders", isAuth(), OrderRouter);

app.post("/mail", sendMail);

// Removed build folder serve logic

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Invalid Credentials" });
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: "Invalid Credentials" });
        }
        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
        done(null, { id: user.id, role: user.role, token });
      });
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("✅ Database connected");
}

app.listen(process.env.port || 5000, () => {
  console.log(`🚀 Server started on port ${process.env.port || 5000}`);
});
