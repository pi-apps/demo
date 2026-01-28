const verifySignature = (payload, signature, publicKey) => {
    // implement crypto verification of user payments
    return crypto.verify("sha256", Buffer.from(payload), publicKey, signature);
};
