# This is an application that subscribes and listens for messages that are being sent to a specific Queue that was set up in Eric's Rabbit MQ service
# The purpose of this application is to receive messages from HipChat (or any client really), and route them to our BeepBoop service for translation, action, and then receive the service's response and give it back to the HipChat user

# Below is all the important credentials and info that was created by Eric to help set up the Queue, and ability to listen to it:
name: beepboop
password: eaa1eea5-03f3-4a35-a044-d8e0351b64ee
hipchat post to: https://hipchat.edamtoft.com/message/beepboop
endpoint for client: amqp.edamtoft.com

# The info above is also used in HipChat to set up the integration that pushes messages to the Queue Eric set up

# Much more work is needed, but basically what we have right now is a way to:
 - Route messages from HipChat to a 3rd party service (Eric's Rabbit MQ) via a HipChat Integration
 - Run an application locally that subscribes to listen to that 3rd party service and get the messages from HipChat that are sent there by the HipChat Integration
 - Ultimately send responses back to whoever sent the message in HipChat via HipChat's API

