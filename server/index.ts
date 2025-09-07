import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..')));

app.listen(port, () => {
  console.log(`Server on at http://localhost:${port}`);
});