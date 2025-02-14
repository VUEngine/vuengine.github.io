---
layout: documentation
parents: Documentation > User Guide
title: Communications
---

# Communications

[VUEngine](https://github.com/VUEngine/VUEngine-Core) supports versus mode in games through connectivity between 2 Virtual Boy systems by means of the Link Cable and the [CommunicationManager](/documentation/api/class-communication-manager/), which manages the hardware’s EXT port. It supports both synchronous and asynchronous communications.

Transmission consists of a message and optional data to be transmitted as a stream of bytes. After the transmission is completed, the client code must check for the validity of the transmitted data by verifying the received message.

```cpp
void SomeClass::transmitData(uint32 messageForRemote, BYTE* data, uint32 dataBytes)
{
    uint32 receivedMessage = kMessageSomeClassDummy;
    const RemotePlayerData* remotePlayerData = NULL;
    CommunicationManager communicationManager = ;

    /*
    * Data will be sent sychroniously. This means that if the cable is disconnected during
    * transmission, the behavior is undefined.
    */
    do
    {
        /*
        * Data transmission can fail if there was already a request to send data.
        */
        if(!CommunicationManager::sendAndReceiveData(communicationManager, messageForRemote, data, dataBytes))
        {
            /*
            * In this case, simply cancel all communications and try again. This supposes
            * that there are no other calls that could cause a race condition.
            */
            CommunicationManager::cancelCommunications(communicationManager);
        }

        /*
        * Every transmission sends a control message and then the data itself.
        */
        receivedMessage = CommunicationManager::getReceivedMessage(communicationManager);
        remotePlayerData = (const RemotePlayerData*)CommunicationManager::getReceivedData(communicationManager);
    }
    /*
    * The validity of the message is based on the command that was received
    */
    while(!SomeClass::isMessageValid(this, receivedMessage, remotePlayerData->command));

    SomeClass::processReceivedMessage(this, messageForRemote, receivedMessage, remotePlayerData);
}
```
