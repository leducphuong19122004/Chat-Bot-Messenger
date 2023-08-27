import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import initRoute from './routes/index.js';
import bodyParser from 'body-parser';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initRoute(app);

// Handle other routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});
  
app.listen(5000, () => console.log('Express server is listening on port 5000'));
