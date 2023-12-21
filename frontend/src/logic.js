
function getSender(loggedInUser, users) {
 return users[0]._id === loggedInUser._id ? users[1].name : users[0].name;
}

function getFullSender(loggedInUser, users) {
 return users[0]._id === loggedInUser._id ? users[1] : users[0];
}


function isLastMessage(messages, i, userId){
    return  (
        i === messages.length - 1 && messages[messages.length - 1].sender._id !== userId && messages[messages.length - 1].sender_id 
    );
}

function isSameSender(messages, m, i, userId){
    return(
        i < messages.length - 1 && (messages[i + 1].sender._id !== m.sender_id || messages[i + 1].sender._id === undefined)
        && messages[i].sender._id !== userId
    );
}

export { getSender, getFullSender, isLastMessage, isSameSender };