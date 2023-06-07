   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
   import { getFirestore, collection, onSnapshot, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";


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

   // Retrieve data from Firestore and display it
   onSnapshot(collection(db, "bookings"), (querySnapshot) => {
       const tableBody = document.getElementById("bookings-table-body");
       tableBody.innerHTML = "";

       querySnapshot.forEach((doc) => {
           const bookingData = doc.data();
           const bookingId = doc.id;

           const row = document.createElement("tr");

           const nameCell = document.createElement("td");
           nameCell.textContent = bookingData.name;
           row.appendChild(nameCell);

           const contactNumberCell = document.createElement("td");
           contactNumberCell.textContent = bookingData.contactNumber;
           row.appendChild(contactNumberCell);

           const emailCell = document.createElement("td");
           emailCell.textContent = bookingData.email;
           row.appendChild(emailCell);

           const preferredDateCell = document.createElement("td");
           preferredDateCell.textContent = bookingData.preferredDate;
           row.appendChild(preferredDateCell);

           const messageCell = document.createElement("td");
           messageCell.textContent = bookingData.message;
           row.appendChild(messageCell);

           const contactedCell = document.createElement("td");
           const contactedCheckbox = document.createElement("input");
           contactedCheckbox.type = "checkbox";
           contactedCheckbox.checked = bookingData.contacted || false;
           contactedCheckbox.addEventListener("change", async (event) => {
               const checked = event.target.checked;
               await updateContactedStatus(bookingId, checked, "bookings");
           });
           contactedCell.appendChild(contactedCheckbox);
           row.appendChild(contactedCell);

           tableBody.appendChild(row);
       });
   });

   onSnapshot(collection(db, "contacts"), (querySnapshot) => {
       const tableBody = document.getElementById("contact-list-body");
       tableBody.innerHTML = "";

       querySnapshot.forEach((doc) => {
           const contactData = doc.data();
           const contactId = doc.id;

           const row = document.createElement("tr");

           const nameCell = document.createElement("td");
           nameCell.textContent = contactData.name;
           row.appendChild(nameCell);

           const emailCell = document.createElement("td");
           emailCell.textContent = contactData.email;
           row.appendChild(emailCell);

           const messageCell = document.createElement("td");
           messageCell.textContent = contactData.message;
           row.appendChild(messageCell);

           const contactedCell = document.createElement("td");
           const contactedCheckbox = document.createElement("input");
           contactedCheckbox.type = "checkbox";
           contactedCheckbox.checked = contactData.contacted || false;
           contactedCheckbox.addEventListener("change", async (event) => {
               const checked = event.target.checked;
               await updateContactedStatus(contactId, checked, "contacts");
           });
           contactedCell.appendChild(contactedCheckbox);
           row.appendChild(contactedCell);

           tableBody.appendChild(row);
       });
   });

   async function updateContactedStatus(docId, checked, collectionName) {
       const batch = writeBatch(db);
       const docRef = doc(db, collectionName, docId);

       batch.update(docRef, { contacted: checked });

       await batch.commit();
   }