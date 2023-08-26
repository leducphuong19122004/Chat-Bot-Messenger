import express from 'express';
import { getWebhook } from '../controllers/getWebhook.js';
import { postWebhook } from '../controllers/postWebhook.js';

let router = express.Router();
const initRoute = (app) =>{
    router.post('/webhook', postWebhook );
    router.get("/webhook", getWebhook);
    return app.use('/', router);
}

export default initRoute;   