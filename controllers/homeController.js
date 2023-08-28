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
    // will be added to the body of our request to the Send API
    let response = {
      "text": "Quý khách vui lòng chờ trong giây lát Shop sẽ phản hồi lại."
    }
    // Sends the response message
    callSendAPI(sender_psid, response); 
} 


// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    let payload = received_postback.payload;
    let title = received_postback.title;
    // Set the response based on the postback payload
    if (payload === 'Bắt Đầu') {
        let response_1 = {"text": "Auth Perfume Shop xin chào quý khách !"};
        callSendAPI(sender_psid, response_1);
        let response_2 = {"text": "Shop xin phép được giới thiệu các dòng sản phẩm nước hoa (chiết 10ml) mà shop đang kinh doanh ạ !"};
        callSendAPI(sender_psid, response_2);

        let response_3 = {
            "attachment":{
                "type":"template",
                "payload":{
                "template_type":"generic",
                "elements":[
                    {
                    "title":"Allure Homme Sport",
                    "image_url":"https://github.com/leducphuong19122004/Chat-Bot-Messenger/blob/master/image%20product/339744864_873563313706097_6438786656393540549_n.jpg?raw=true",
                    "subtitle":"Allure Homme Sport có mùi hương thế thao sảng khoái. Giá dành cho lọ chiết 10ml chỉ có 389k",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://www.originalcoastclothing.com/",
                        "webview_height_ratio": "tall"
                    },
                    "buttons":[
                        {
                            "type":"web_url",
                            "url":"https://www.originalcoastclothing.com/",
                            "title":"Ghé Shop"
                        },
                       {
                        "type":"postback",
                        "title":"Mua Ngay",
                        "payload":"Allure Homme Sport"
                        }              
                    ]      
                    },
                    {
                        "title":"Replica Sunday Lazy Morning",
                        "image_url":"https://github.com/leducphuong19122004/Chat-Bot-Messenger/blob/master/image%20product/361851670_234014122912064_2053498349774634806_n.jpg?raw=true",
                        "subtitle":"Replica Sunday Lazy Morning có mùi hương nhẹ nhàng, thư thái như những tia nắng đầu tiên chiếu vào căn phòng. Giá dành cho lọ chiểt 10ml chỉ có 309k.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.originalcoastclothing.com/",
                            "webview_height_ratio": "tall"
                        },
                        "buttons":[
                            {
                            "type":"web_url",
                            "url":"https://www.originalcoastclothing.com/",
                            "title":"Ghé Shop"
                            },{
                            "type":"postback",
                            "title":"Mua Ngay",
                            "payload":"Replica Sunday Lazy Morning"
                            }              
                        ]      
                    },
                    {
                        "title":"Aqua di Giò (giò trắng)",
                        "image_url":"https://github.com/leducphuong19122004/Chat-Bot-Messenger/blob/master/image%20product/340995575_152940491054615_6413215964939907130_n.jpg?raw=true",
                        "subtitle":"Chỉ cần nhìn Giò trắng, bạn cảm nhận được hương cam chanh dễ chịu, hòa quyện cùng hương nước sảng khoái và hoa nhẹ nhàng. Giá dành cho lọ chiết 10ml chỉ có 209k.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.originalcoastclothing.com/",
                            "webview_height_ratio": "tall"
                        },
                        "buttons":[
                            {
                            "type":"web_url",
                            "url":"https://www.originalcoastclothing.com/",
                            "title":"Ghé Shop"
                            },{
                            "type":"postback",
                            "title":"Mua Ngay",
                            "payload":"Aqua di Giò (giò trắng)"
                            }              
                        ]      
                    },
                    {
                        "title":"9PM",
                        "image_url":"https://github.com/leducphuong19122004/Chat-Bot-Messenger/blob/master/image%20product/361931014_827126525591849_4484168111083657093_n.jpg?raw=true",
                        "subtitle":"Afnan 9pm là chai nước hoa nam quyến rũ giúp anh em trở nên mạnh mẽ, nồng nàn hơn mỗi khi màn đêm buông xuống. Giá dành cho lọ chiết 10ml chỉ có 99k.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.originalcoastclothing.com/",
                            "webview_height_ratio": "tall"
                        },
                        "buttons":[
                            {
                            "type":"web_url",
                            "url":"https://www.originalcoastclothing.com/",
                            "title":"Ghé Shop"
                            },{
                            "type":"postback",
                            "title":"Mua Ngay",
                            "payload":"9PM"
                            }              
                        ]      
                    },
                    {
                        "title":"Narciso trắng",
                        "image_url":"https://github.com/leducphuong19122004/Chat-Bot-Messenger/blob/master/image%20product/362093250_609687084600094_6154365417199498798_n.jpg?raw=true",
                        "subtitle":"Narciso trắng dịu dàng nhưng mạnh mẽ, ôm trọn cơ thể và gợi cảm xúc cho người đối diện. Giá dành cho lọ chiết 10ml chỉ có 239k.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.originalcoastclothing.com/",
                            "webview_height_ratio": "tall"
                        },
                        "buttons":[
                            {
                            "type":"web_url",
                            "url":"https://www.originalcoastclothing.com/",
                            "title":"Ghé Shop"
                            },{
                            "type":"postback",
                            "title":"Mua Ngay",
                            "payload":"Narciso trắng"
                            }              
                        ]      
                    }
                ]
                }
            }
        }
        callSendAPI(sender_psid, response_3);
    }
    if(title === "Mua Ngay") {
        let response_4 = {"text": `Có phải anh/chị muốn đặt mua lọ "${payload}" phải không ạ ? Nếu vậy anh/chị vui lòng để lại họ tên, số điện thoại, địa chỉ để Shop lên đơn ship cho anh/chị nhé !`};
        callSendAPI(sender_psid, response_4);
    }
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

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}