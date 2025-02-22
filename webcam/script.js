const stopCam = () => {
    const video = document.getElementById("video");

    if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
    }

    sessionStorage.removeItem("cameraAllowed");

    window.location.href = "../index.html"; // Adjust the path if needed
};

const startCam = () => {
    const video = document.getElementById("video"); // Ensure video element is selected
    const retakeButton = document.getElementById("retakeButton");
    const nextButton = document.getElementById("nextButton");

    //disable buttons to continue

        retakeButton.disabled = true;
        nextButton.disabled = true;


    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Camera access denied:", error);
            alert("IN ORDER TO PROCEED, PLEASE ALLOW CAMERA. THANK YOU.♡");   
            history.back();
        });
};

function takePhoto() {
    const button = document.getElementById("photoButton");
    const video = document.getElementById("video");
    const capturedImage = document.getElementById("capturedImage");

    //if (capturedImage.src && capturedImage.style.display !== "none") {
    //    return;
    //}

    button.disabled = true;

    let flashes = 0;

    function flashEffect() {
        if (flashes < 5) {
            button.classList.toggle("active");
            flashes++;
            setTimeout(flashEffect, 300);
        } else {
            button.classList.remove("active");

            const tempCanvas = document.createElement("canvas");
            const context = tempCanvas.getContext("2d");
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;

            // Draw the video frame onto the canvas
            context.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
            

            const imageData = tempCanvas.toDataURL("image/png");
            localStorage.setItem("capturedImage", imageData);

            // Set the image source to the captured frame
            capturedImage.src = tempCanvas.toDataURL("image/png");
            capturedImage.style.display = "block";

            // Hide the video
            video.style.display = "none";
            
            retakeButton.disabled = false;
            nextButton.disabled = false;
        }
    }

    flashEffect();
    
}

function next() {
    window.location.href = "upload.html";
}

function retake() {
    const video = document.getElementById("video");
    const capturedImage = document.getElementById("capturedImage");
    const button = document.getElementById("photoButton");

    // Remove the stored image
    localStorage.removeItem("capturedImage");

    // Clear and hide the captured image
    capturedImage.src = "";
    capturedImage.style.display = "none";

    // Show the video again
    video.style.display = "block";

    button.disabled = false;
    // Reactivate the webcam
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing webcam:", error);
            alert("Unable to access the camera.");
        });
    
    retakeButton.disabled = true;
    nextButton.disabled = true;
    button.disabled = false;
}

document.addEventListener("DOMContentLoaded", function () {
    const anonymousRadio = document.getElementById("anonymous");
    const uniqueIdRadio = document.getElementById("unique-id");
    const userIdInput = document.getElementById("userID");
    const submitButton = document.getElementById("submitBtn");

    // Disable input initially
    userIdInput.disabled = true;

    // Toggle input field based on selection
    function toggleInput() {
        if (uniqueIdRadio.checked) {
            userIdInput.disabled = false;
            userIdInput.required = true;
        } else {
            userIdInput.disabled = true;
            userIdInput.required = false;
            userIdInput.value = ""; // Clear input when disabled
        }
    }

    // Ensure only numbers are allowed in the input field
    userIdInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Remove non-numeric characters
    });

    // Add event listeners to radio buttons
    anonymousRadio.addEventListener("change", toggleInput);
    uniqueIdRadio.addEventListener("change", toggleInput);

    // Submit button function
    submitButton.addEventListener("click", function (event) {
        if (uniqueIdRadio.checked && userIdInput.value.trim() === "") {
            alert("Please enter a Unique ID.");
            event.preventDefault();
        } else {
            alert("Submission successful.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("discardButton").addEventListener("click", function () {
        const confirmDiscard = confirm("WARNING: Your photo will be lost and cannot be retrieved. Do you want to continue?");
        
        if (confirmDiscard) {
            localStorage.removeItem("capturedImage"); 
            window.location.href = "webcam.html"; 
        }
    });
});
