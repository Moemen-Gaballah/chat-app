const socket = io();

socket.on("connect", () => {
    let id = document.getElementById("userId").value;
    socket.emit("joinNotificationsRoom", id);
});

socket.on("newFriendRequest", data => {
    const friendRequests = document.getElementById("friendRequests");
    const span = friendRequests.querySelector("span");

    // TODO


})
