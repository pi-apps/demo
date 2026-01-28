module.exports = function (req, res, next) {
    const token = req.headers["x-gov-auth"];

    if (!token || token !== process.env.GOV_API_SECRET) {
        return res.status(403).json({ message: "Unauthorized Government Access" });
    }

    next();
};
