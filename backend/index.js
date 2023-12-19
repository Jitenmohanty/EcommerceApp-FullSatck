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
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Productrouter from "./Routes/ProductRoute.js";
import Brandrouter from "./Routes/BrandRoute.js";
import Categoryrouter from "./Routes/CategoryRoute.js";
import UserRouter from "./Routes/UserRoutes.js";
import AuthRouter from "./Routes/AuthRoutes.js";
import CartRouter from "./Routes/CartRoutes.js";
import OrderRouter from "./Routes/OrderRoute.js";
import { cookieExtractor, isAuth, sanitizeUser } from "./Services/common.js";
import { User } from "./Models/User.js";

import stripeModule from 'stripe';
import { Order } from "./Models/Order.js";

const stripe = stripeModule(process.env.STRIPE_SERVER_KEY);

// Webhook

// TODO: we will capture actual order after deploying out server live on public URL

const endpointSecret = process.env.ENDPOINT_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus='received';
      await order.save()
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

app.use(passport.authenticate("session"));

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

// app.use(express.raw({type:"application/json"}))
app.use(express.json());
app.use("/users", isAuth(), UserRouter);
app.use("/auth", AuthRouter);
// we can also use JWT token for client-only auth
app.use("/products", isAuth(), Productrouter);
app.use("/brands", isAuth(), Brandrouter);
app.use("/categories", isAuth(), Categoryrouter);
app.use("/cart", isAuth(), CartRouter);
app.use("/orders", isAuth(), OrderRouter);

app.get('*',(req,res)=> res.sendFile(path.resolve('build','index.html')))

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: "Invalid Credentials" }); //for saftey
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          done(null, { id: user.id, role: user.role,token }); // this lines sends to serializer
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });

    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serielizer
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
        orderId
      }
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("database connected");
}

app.listen(process.env.port, () => {
  console.log("server started.");
});
