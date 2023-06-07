// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAZfYDfwza5IF-3WXAsrz0bL0s6-HeO8PU",
    authDomain: "kodego-staybnb.firebaseapp.com",
    projectId: "kodego-staybnb",
    storageBucket: "kodego-staybnb.appspot.com",
    messagingSenderId: "474414165470",
    appId: "1:474414165470:web:397c698ac971b8d09c814f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit form data to Firestore
var bookingForm = document.getElementById("booking-form");
bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    var name = document.getElementById("name").value;
    var contactNumber = document.getElementById("contact-number").value;
    var email = document.getElementById("email").value;
    var preferredDate = document.getElementById("preferred-date").value;
    var message = document.getElementById("message").value;

    try {
        // Save form data to Firestore
        const docRef = await addDoc(collection(db, "bookings"), {
            name: name,
            contactNumber: contactNumber,
            email: email,
            preferredDate: preferredDate,
            message: message,
            contacted: false
        });

        // Reset form after successful submission
        bookingForm.reset();
        alert("Your booking has been submitted successfully!");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("An error occurred. Please try again later.");
    }
});