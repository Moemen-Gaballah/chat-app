const socket = io();
const btn = document.getElementById("friendRequestsDropdown")

socket.on("connect", () => {
    let id = document.getElementById("userId").value;
    socket.emit("joinNotificationsRoom", id);
});

socket.on("newFriendRequest", data => {
    const friendRequests = document.getElementById("friendRequests");
    const span = friendRequests.querySelector("span");
    if(span) span.remove();
    friendRequests.innerHTML += `
        <a class="dropdown-item" href="/profile/${data.id}">
            ${data.name}
        </a>
    `;

    const btn = document.getElementById('friendRequestsDropdown');
    btn.classList.remove('btn-primary')
    btn.classList.add('btn-danger');
});

btn.onclick = () => {
    btn.classList.add('btn-primary')
    btn.classList.remove('btn-danger');
}
