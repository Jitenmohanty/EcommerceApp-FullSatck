import express from "express";
import dotenv from "dotenv";
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
import { fileURLToPath } from "url";
import { dirname } from "path";

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
import { Order } from "./Models/Order.js";

import stripeModule from "stripe";
const stripe = stripeModule(process.env.STRIPE_SERVER_KEY);

// Stripe Webhook
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post("/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log({ paymentIntentSucceeded });
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus = "received";
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

// ✅ Allow only localhost:3000 (Next.js frontend)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use(express.json());

// ✅ Root route - shows backend health
app.get("/", async (req, res) => {
  try {
    // Check current Mongoose connection state
    const state = mongoose.connection.readyState;

    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
    if (state === 1) {
      res.status(200).json({ message: "✅ Backend running perfectly fine! Database connected." });
    } else if (state === 2) {
      res.status(503).json({ message: "⏳ Backend is running, but MongoDB is still connecting..." });
    } else {
      // Try pinging MongoDB manually for verification
      await mongoose.connection.db.admin().ping();
      res.status(200).json({ message: "✅ Backend running perfectly fine! Database reachable." });
    }
  } catch (error) {
    res.status(500).json({
      message: "❌ Backend running, but MongoDB not connected.",
      error: error.message,
    });
  }
});


// Routes
app.use("/users", isAuth(), UserRouter);
app.use("/auth", AuthRouter);
app.use("/products", isAuth(), Productrouter);
app.use("/brands", isAuth(), Brandrouter);
app.use("/categories", isAuth(), Categoryrouter);
app.use("/cart", isAuth(), CartRouter);
app.use("/orders", isAuth(), OrderRouter);
app.post("/mail", sendMail);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) return done(null, false, { message: "Invalid Credentials" });

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
      if (user) return done(null, sanitizeUser(user));
      else return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, role: user.role }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
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

// ✅ Wait for MongoDB before starting server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.port || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("Visit → http://localhost:" + PORT + "/");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
