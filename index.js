import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1lTNAJAgQAQv2T4grsLSXPrQTqcLcA1o",
  authDomain: "bookmark-manager-15fa5.firebaseapp.com",
  projectId: "bookmark-manager-15fa5",
  storageBucket: "bookmark-manager-15fa5.appspot.com",
  messagingSenderId: "777035641832",
  appId: "1:777035641832:web:a86c98e19ee20b4ed36a5d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const collRef = collection(db, "bookmartks");

const flash = document.querySelector(".flash");
const warning = document.querySelector(".warning");

function showFlash() {
  flash.innerHTML = "Bookmark added successfully";
}

function displayWarning() {
  warning.innerHTML = "Input fields can not be empty"
}

function hideFlash() {
  flash.style.display = "none";
  warning.style.display = "none";
}

function refreshPage() {
  window.location.reload();
}




function deleteEvent() {
  const deleteButtons = document.querySelectorAll("i.delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      //delete reference, the doc carries 3 parameter, the database, the database name and the id
      const deleteRef = doc(db, "bookmartks", button.dataset.id);
      deleteDoc(deleteRef)
        .then(() => {
          button.parentElement.parentElement.parentElement.remove();
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
}

//Get documents from the data base and display them

function generateTemplate(response, id) {
  return `<div class="card">
            <p class="title">${response.title}</p>
            <div class="sub-information">
              <p>
                <span class="category ${
                  response.category
                }">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
              </p>
              <a href="${
                response.link
              }" target="_blank" title="Open link"><i class="bi bi-box-arrow-up-right website"></i></a>
              <a href="https://www.google.com/search?q=${
                response.title
              }" target="_blank" title="Search on google"><i class="bi bi-google search"> </i></a>
              <span><i class="bi bi-trash delete" title="delete this item" data-id="${id}"></i></span>
            </div>
          </div> `;
}

const cards = document.querySelector(".cards");

function displayCards() {
  cards.innerHTML += "";
  getDocs(collRef)
    .then((data) => {
      data.docs.forEach((document) => {
        cards.innerHTML += generateTemplate(document.data(), document.id);
      });
      deleteEvent();
    })
    .catch((error) => {
      console.log(error);
    });
}
displayCards();

// Add docs/links to the data base
const addForm = document.querySelector(".add");
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
    addDoc(collRef, {
      link: addForm.link.value,
      title: addForm.title.value,
      category: addForm.category.value,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        // cards.innerHTML += "";
        // displayCards();
        showFlash();
        // setTimeout(hideFlash, 3000);
        addForm.reset();
        setTimeout(refreshPage(), 3000);
      })
      .catch((error) => {
        console.log(error);
      });
    
  
});

function filteredCards(category){
  if (category == "all") {
    displayCards();
    refreshPage();
  } else{

    const queryRef = query(collRef, where("category", "==", category));
  
    // Clear the contents of the `cards` element.
    cards.innerHTML = "";
  
    // Get the data from the database.
    getDocs(queryRef)
      .then((data) => {
        // Iterate over the data and add it to the `cards` element.
        data.docs.forEach((document) => {
          cards.innerHTML += generateTemplate(document.data(), document.id);
        });
  
        // Add the delete event listeners.
        deleteEvent();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

//Category list and filtering
const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");
categoryList.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    filteredCards(event.target.innerText.toLowerCase());
    categorySpan.forEach(span => span.classList.remove("active"));
    event.target.classList.add("active");
  }
});


