import { Router } from "express";

import platformAPIClient from "../services/platformAPIClient";
import { setCurrentUser } from "./payments";


export default function mountUserEndpoints(router: Router) {

  router.get ('/test', async (req,res) => {
    return res.status(200).json({ message: "Working!" });
  })

  router.get ('/test2', async (req,res) => {
    const userCollection = req.app.locals.userCollection;
    const insertResult = await userCollection.insertOne({
      username:"test",
      uid: "test",
      roles: "test",
      accessToken: "test"
    });
    console.log("##############")
    const currentUser = await userCollection.findOne(insertResult.insertedId);
    return res.status(200).setHeader("Access-Control-Allow-Origin","*").json({ message: "Working!" , user: currentUser});
  })

  // handle the user auth accordingly
  router.post('/signin', async (req, res) => {
    // try {
      const auth = req.body.authResult;
      const userCollection = req.app.locals.userCollection;

      try {
        // Verify the user's access token with the /me endpoint:
        const me = await platformAPIClient.get(`/v2/me`, { headers: { 'Authorization': `Bearer ${auth.accessToken}` } });
        console.log(me);
      } catch (err) {
        console.log(err);
        return res.status(401).json({error: "Invalid access token"}) 
      }

      let currentUser = await userCollection.findOne({ uid: auth.user.uid });
      
      if (currentUser) {
        await userCollection.updateOne({
          _id: currentUser._id
        }, {
          $set: {
            accessToken: auth.accessToken,
          }
        });
        console.log("**************")
      } else {
        const insertResult = await userCollection.insertOne({
          username: auth.user.username,
          uid: auth.user.uid,
          roles: auth.user.roles,
          accessToken: auth.accessToken
        });
        console.log("##############")
        currentUser = await userCollection.findOne(insertResult.insertedId);
      }

      // req.session.currentUser = currentUser;
      setCurrentUser(currentUser);
      console.log("user set to "+currentUser?.uid)
      return res.status(200).json({ currentUser });
  //   }catch(err){
  //     return res.status(200).json({ message: "User didnt sign in" });
  // }
  });

  // handle the user auth accordingly
  router.get('/signout', async (req, res) => {
    // req.session.currentUser = null;
    setCurrentUser(null);
    console.log("user set to null")
    return res.status(200).json({ message: "User signed out" });
  });
}
