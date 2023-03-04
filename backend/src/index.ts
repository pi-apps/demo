import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import MongoStore from 'connect-mongo';
import { MongoClient, ServerApiVersion } from 'mongodb';
import env from './environments';
import mountUserEndpoints from './handlers/users';
import * as functions from 'firebase-functions'
// const functions = require("firebase-functions");
// import functions from "firebase-functions"
// const functions =  require("firebase-functions")
// const { MongoClient, ServerApiVersion } = require('mongodb');
// We must import typedefs for ts-node-dev to pick them up when they change (even though tsc would supposedly
// have no problem here)
// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata#comment125163548_65381085
import "./types/session";
import mountPaymentsEndpoints from './handlers/payments';

// For local mongo db server
const dbName = env.mongo_db_name;
// // const mongoUri = `mongodb//${env.mongo_host}/${dbName}`;
// const mongoUri = `mongodb+srv://testuser1:giQEO5m5D46dpf1c@cluster0.oemucdi.mongodb.net/?retryWrites=true&w=majority`;
// const mongoClientOptions = {
//   authSource: "admin",
//   auth: {
//     username: env.mongo_user,
//     password: env.mongo_password,
//   },
// }

// mongodb+srv://<username>:<password>@cluster0.yvnm2ng.mongodb.net/?retryWrites=true&w=majority
const mongoUri2 = "mongodb+srv://testuser1:giQEO5m5D46dpf1c@cluster0.oemucdi.mongodb.net/?retryWrites=true&w=majority";
const client2 = new MongoClient(mongoUri2, { serverApi: ServerApiVersion.v1 });


//
// I. Initialize and set up the express app and various middlewares and packages:
//

const app: express.Application = express();

// Log requests to the console in a compact format:
// app.use(logger('dev'));

// Full log of all requests to /log/access.log:
// app.use(logger('common', {
//   stream: fs.createWriteStream(path.join(__dirname, '..', 'log', 'access.log'), { flags: 'a' }),
// }));

// Enable response bodies to be sent as JSON:
app.use(express.json())

// Handle CORS:
app.use(cors({
  origin: ['http://localhost:3314','https://dcert-40a5b.web.app'],
  credentials: true
}));

// Handle cookies 🍪
app.use(cookieParser());

// Use sessions:
// app.use(session({
//   secret: env.session_secret,
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: mongoUri,
//     mongoOptions: mongoClientOptions,
//     dbName: dbName,
//     collectionName: 'user_sessions'
//   }),
// }));


//
// II. Mount app endpoints:
//

// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use('/payments', paymentsRouter);

// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use('/user', userRouter);

// Hello World page to check everything works:
app.get('/', async (_, res) => {
  res.status(200).send({ message: "Hello, World!" });
});


// III. Boot up the app:

app.listen(8000, async () => {
  //for local Mongo Db
  // try {
  //   const client = await MongoClient.connect(mongoUri, mongoClientOptions)
  //   const db = client.db(dbName);
  //   app.locals.orderCollection = db.collection('orders');
  //   app.locals.userCollection = db.collection('users');
  //   console.log('Connected to MongoDB on: ', mongoUri)
  // } catch (err) {
  //   console.error('Connection to MongoDB failed: ', err)
  // }

  try {
    const client = await MongoClient.connect(mongoUri2, { serverApi: ServerApiVersion.v1 });
    const db = client.db(dbName);
    app.locals.orderCollection = db.collection('orders');
    app.locals.userCollection = db.collection('users');
    console.log('Connected to MongoDB on: ', mongoUri2)
  } catch (err) {
    console.error('Connection to MongoDB failed: ', err)
  }

  // try{
  //   client2.connect(err => {
  //     const collection = client2.db("test").collection("devices");
  //     // perform actions on the collection object
  //     // client2.close();
  //     console.log("Created online db ");
  //   });
  // } catch (err) {
  //   console.log("Online db caused error")
  // }

  console.log('App platform demo app - Backend listening on port 8000!');
  console.log(`CORS config: configured to respond to a frontend hosted on ${env.frontend_url}`);
});

export const api = functions.https.onRequest(app)
// exports.api = functions.https.onRequest((_request: any, response: { send: (arg0: string) => void; }) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// export const api = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
