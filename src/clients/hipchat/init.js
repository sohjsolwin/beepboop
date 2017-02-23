// npm install hipchat-webqueue-client node-fetch os
const os = require("os");
const fetch = require("node-fetch");
const HipchatQueueClient = require("hipchat-webqueue-client");
const queue = new HipchatQueueClient({ 
  username: "beepboop", 
  password: "eaa1eea5-03f3-4a35-a044-d8e0351b64ee", 
  endpoint: "amqp.edamtoft.com", 
  queue: "beepboop"
});
queue.messages.subscribe(msg => console.log(JSON.stringify(msg)));

queue.connect().then(() => console.log("Connected"));