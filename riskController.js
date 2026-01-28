const { analyzeTransaction } = require("./riskEngine");

exports.checkTransactionRisk = (req, res) => {
    const txData = req.body;
    const result = analyzeTransaction(txData);

    if (result.riskLevel === "HIGH") {
        console.log("🚨 HIGH RISK ALERT:", result);
        // Later tuzohuza na Government Dashboard Alert System
    }

    res.json({
        message: "Risk analysis complete",
        analysis: result
    });
};
