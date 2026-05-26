"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mountUserEndpoints;
const platformAPIClient_1 = __importDefault(require("../services/platformAPIClient"));
function mountUserEndpoints(router) {
    // handle the user auth accordingly
    router.post("/signin", async (req, res) => {
        const auth = req.body.authResult;
        const userCollection = req.app.locals.userCollection;
        if (!userCollection) {
            return res.status(503).json({ error: "service_unavailable", message: "Database not ready" });
        }
        try {
            // Verify the user's access token with the /me endpoint:
            const me = await platformAPIClient_1.default.get(`/v2/me`, { headers: { Authorization: `Bearer ${auth.accessToken}` } });
            console.log(me);
        }
        catch (err) {
            console.error("Error verifying access token:", err);
            return res.status(401).json({ error: "invalid_token", message: "Invalid access token" });
        }
        try {
            let currentUser = await userCollection.findOne({ uid: auth.user.uid });
            if (currentUser) {
                await userCollection.updateOne({
                    _id: currentUser._id,
                }, {
                    $set: {
                        accessToken: auth.accessToken,
                    },
                });
            }
            else {
                const insertResult = await userCollection.insertOne({
                    username: auth.user.username,
                    uid: auth.user.uid,
                    roles: auth.user.roles,
                    accessToken: auth.accessToken,
                });
                currentUser = await userCollection.findOne(insertResult.insertedId);
            }
            req.session.currentUser = currentUser;
            return res.status(200).json({ message: "User signed in" });
        }
        catch (err) {
            console.error("Error during signin:", err);
            return res.status(500).json({ error: "internal_error", message: "Failed to sign in" });
        }
    });
    // handle the user auth accordingly
    router.get("/signout", async (req, res) => {
        req.session.currentUser = null;
        return res.status(200).json({ message: "User signed out" });
    });
}
