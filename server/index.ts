import express from 'express';
     import path from 'path';

     const app = express();
     const port = 3000;

     // Serve frontend files from the root folder
     app.use(express.static(path.join(__dirname, '..')));

     app.listen(port, () => {
       console.log(`Server on at http://localhost:${port}`);
     });