const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const escrowController = require('./escrowController');
const reputationService = require('./reputationService');
const disputeHandler = require('./disputeHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/escrow', escrowController);
app.use('/api/reputation', reputationService);
app.use('/api/dispute', disputeHandler);

app.get('/', (req, res) => {
  res.send('TrustSphere backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
