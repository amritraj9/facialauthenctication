let video;
let canvas;
let nameInput;
let stream = null;

function init(){
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    nameInput = document.getElementById("name");
    const toggleButton = document.getElementById("toggleButton");

    toggleButton.addEventListener('click', () => {
        if (stream) {
            stopCamera();
        } else {
            startCamera();
        }
    });
}

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        document.getElementById("toggleButton").textContent = "Stop Camera";
    } catch (error) {
        console.log("Error accessing webcam", error);
        alert("Cannot access webcam");
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        document.getElementById("toggleButton").textContent = "Start Camera";
    }
}

function capture(){
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    video.style.display = "none";
}
function refreshPage() {
    location.reload();
}

function register(){
    const name = nameInput.value;
    const photo = dataURItoBlob(canvas.toDataURL());
    if (!name || !photo) {
        alert("Name and photo required, please");
        return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photo, `${name}.jpg`);

    fetch("/register", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Data successfully registered");
                location.reload();
            } else {
                alert("Registration failed");
            }
        })
        .catch(error => {
            console.log("Error", error);
        });
}

function login(){
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = dataURItoBlob(canvas.toDataURL());
    if (!photo) {
        alert("Photo required, please");
        return;
    }
    const formData = new FormData();
    formData.append("photo", photo, "login.jpg");

    fetch("/login", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Login successful!");
                window.location.href = `/success?user_name=${encodeURIComponent(data.name)}`;
            } else {
                alert("Login failed, please try again");
            }
        })
        .catch(error => {
            console.log("Error", error);
        });
}

function dataURItoBlob(dataURI){
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

init();
