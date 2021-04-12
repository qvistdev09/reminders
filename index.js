const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Testing the API' });
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
