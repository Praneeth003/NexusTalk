
function getSender(loggedInUser, users) {
 return users[0]._id === loggedInUser._id ? users[1].name : users[0].name;
}

function getFullSender(loggedInUser, users) {
 return users[0]._id === loggedInUser._id ? users[1] : users[0];
}
export { getSender, getFullSender };