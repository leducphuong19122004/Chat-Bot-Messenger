import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import initRoute from './routes/index.js';
import bodyParser from 'body-parser';
import configViewEngine from './configs/viewEngine.js';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initRoute(app);
configViewEngine(app);


app.listen(5000, () => console.log('Express server is listening on port 5000'));
