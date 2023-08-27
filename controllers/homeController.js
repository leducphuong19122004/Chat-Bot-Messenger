import request from 'request';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export let getWebhook = (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
        } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
        }
    }
}

export let getHomePage = (req, res) => {
    res.send("SERVER ON");
}

export let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

export let settingGetstartedButton = async(req, res) => {
    try {
        const pageAccessToken = process.env.ACCESS_TOKEN; // Replace with your actual Page Access Token
        
        const request_body = {
          get_started: { payload: 'Get Started' }
        };
        
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/me/messenger_profile?access_token=${pageAccessToken}`,
          request_body
        );
        
        console.log(response.data);
            res.status(200).send('Get Started Button Set Up Successfully');
      } catch (error) {
            console.error('Error setting up Get Started button:', error);
            res.status(500).send('Internal Server Error');
      }
}
// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains text
  if (received_message.text) {
    // Creates the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
        }
    }
    // Sends the response message
    callSendAPI(sender_psid, response); 
  } 


// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload
    if (payload === 'Bắt Đầu') {
        let response_1 = {"text": "Auth Perfume Shop xin chào quý khách !"};
        await callSendAPI(sender_psid, response_1);

        let response_2 = {
            "attachment":{
                "type":"template",
                "payload":{
                "template_type":"generic",
                "elements":[
                    {
                    "title":"Welcome!",
                    "image_url":"https://raw.githubusercontent.com/fbsamples/original-coast-clothing/main/public/styles/male-work.jpg",
                    "subtitle":"We have the right hat for everyone.",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://www.originalcoastclothing.com/",
                        "webview_height_ratio": "tall"
                    },
                    "buttons":[
                        {
                        "type":"web_url",
                        "url":"https://www.originalcoastclothing.com/",
                        "title":"View Website"
                        },{
                        "type":"postback",
                        "title":"Start Chatting",
                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
                        }              
                    ]      
                    }
                ]
                }
            }
        }
        await callSendAPI(sender_psid, response_2);
    }
    // Send the message to acknowledge the postback
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
        "id": sender_psid
        },
        "message": response
    }
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": process.env.ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        }); 
        
    })

}