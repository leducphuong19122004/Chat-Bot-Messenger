import express from 'express';
import { getHomePage, getWebhook, postWebhook, settingGetstartedButton } from '../controllers/homeController.js';


let router = express.Router();
const initRoute = (app) =>{
    router.get('/', getHomePage);
    router.get('/setup-profile', settingGetstartedButton);
    router.post('/webhook', postWebhook );
    router.get("/webhook", getWebhook);
    return app.use('/', router);
}

export default initRoute;   