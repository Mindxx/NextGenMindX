// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWxDrIBv7f4zdmZxG-jUxzLLtJX2Kc4Zs",
    authDomain: "apartment-management-931bf.firebaseapp.com",
    projectId: "apartment-management-931bf",
    storageBucket: "apartment-management-931bf.firebasestorage.app",
    messagingSenderId: "561672691060",
    appId: "1:561672691060:web:2db698d55dea9962ac2021"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Form elements
const addForm = document.getElementById('addForm');
const apartmentName = document.getElementById('apartmentName');
const apartmentPrice = document.getElementById('apartmentPrice');
const apartmentDescription = document.getElementById('apartmentDescription');
const imageUpload = document.getElementById('imageUpload');
const updateForm = document.getElementById('updateForm');
const updateName = document.getElementById('updateName');
const updatePrice = document.getElementById('updatePrice');
const updateDescription = document.getElementById('updateDescription');
const updateImageUpload = document.getElementById('updateImageUpload');
const apartmentList = document.getElementById('apartmentList');

// Add apartment to Firebase
addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = apartmentName.value;
    const price = apartmentPrice.value;
    const description = apartmentDescription.value;
    const image = imageUpload.files[0];

    if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result;
            const newApartmentRef = database.ref('apartments').push();
            newApartmentRef.set({
                name: name,
                price: price,
                description: description,
                image: imageData
            }).then(() => {
                alert("Apartment added successfully!");
                resetAddForm();
                displayApartments();
            });
        };
        reader.readAsDataURL(image);
    }
});

// Display apartments from Firebase
function displayApartments() {
    apartmentList.innerHTML = "";
    database.ref('apartments').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const apartment = childSnapshot.val();
            const apartmentDiv = document.createElement('div');
            apartmentDiv.classList.add('apartment');

            apartmentDiv.innerHTML = `
          <h4>${apartment.name}</h4>
          <p>${apartment.description}</p>
          <p>Price: $${apartment.price}</p>
          <img src="${apartment.image}" alt="Apartment Image">
          <button onclick="editApartment('${childSnapshot.key}')">Edit</button>
          <button onclick="deleteApartment('${childSnapshot.key}')">Delete</button>
        `;
            apartmentList.appendChild(apartmentDiv);
        });
    });
}

// Edit apartment
function editApartment(id) {
    const apartmentRef = database.ref('apartments/' + id);
    apartmentRef.once('value', (snapshot) => {
        const apartment = snapshot.val();
        updateName.value = apartment.name;
        updatePrice.value = apartment.price;
        updateDescription.value = apartment.description;

        updateForm.style.display = 'block';

        updateForm.onsubmit = (e) => {
            e.preventDefault();
            const updatedName = updateName.value;
            const updatedPrice = updatePrice.value;
            const updatedDescription = updateDescription.value;
            const updatedImage = updateImageUpload.files[0];

            if (updatedImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const updatedImageData = reader.result;
                    apartmentRef.update({
                        name: updatedName,
                        price: updatedPrice,
                        description: updatedDescription,
                        image: updatedImageData
                    }).then(() => {
                        alert("Apartment updated successfully!");
                        resetUpdateForm();
                        displayApartments();
                    });
                };
                reader.readAsDataURL(updatedImage);
            } else {
                apartmentRef.update({
                    name: updatedName,
                    price: updatedPrice,
                    description: updatedDescription
                }).then(() => {
                    alert("Apartment updated successfully!");
                    resetUpdateForm();
                    displayApartments();
                });
            }
        };
    });
}

// Delete apartment
function deleteApartment(id) {
    const apartmentRef = database.ref('apartments/' + id);
    apartmentRef.remove().then(() => {
        alert("Apartment deleted successfully!");
        displayApartments();
    });
}

// Reset add form
function resetAddForm() {
    apartmentName.value = '';
    apartmentPrice.value = '';
    apartmentDescription.value = '';
    imageUpload.value = '';
}

// Reset update form
function resetUpdateForm() {
    updateName.value = '';
    updatePrice.value = '';
    updateDescription.value = '';
    updateImageUpload.value = '';
    updateForm.style.display = 'none';
}

// Initial display of apartments
displayApartments();
