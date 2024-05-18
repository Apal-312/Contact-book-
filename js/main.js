const API = "http://localhost:8000/contacts";
const inputs = document.querySelectorAll(".contact-input");
const btnAdd = document.querySelector(".btn-add");
const contactList = document.querySelector(".contact-list");
const editModal = document.querySelector(".edit-modal");
const editInputs = document.querySelectorAll(".edit-input");
const btnSaveEdit = document.querySelector(".btn-save-edit");

// CREATE (добавление)
btnAdd.addEventListener("click", () => {
  let newContact = {
    name: inputs[0].value,
    surname: inputs[1].value,
    phone: inputs[2].value,
    photo: inputs[3].value,
  };

  if (
    !newContact.name.trim() ||
    !newContact.surname.trim() ||
    !newContact.phone.trim() ||
    !newContact.photo.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  createContact(newContact);
  inputs.forEach((input) => (input.value = ""));
});

function createContact(contact) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}

// READ (отображение)
function readContacts() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      contactList.innerHTML = "";
      data.forEach((contact) => {
        contactList.innerHTML += `
          <li class="contact-item">
            <img src="${contact.photo}" alt="Photo" width="50">
            <span>${contact.name} ${contact.surname} - ${contact.phone}</span>
            <div class="contact-actions">
              <button class="edit" data-id="${contact.id}">Edit</button>
              <button class="delete" data-id="${contact.id}">Delete</button>
            </div>
          </li>
        `;
      });
    });
}
readContacts();

// DELETE (удаление)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    let id = e.target.dataset.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readContacts());
  }
});

// EDIT (редактирование)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    let id = e.target.dataset.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInputs[0].value = data.name;
        editInputs[1].value = data.surname;
        editInputs[2].value = data.phone;
        editInputs[3].value = data.photo;
        btnSaveEdit.setAttribute("data-id", data.id);
        editModal.style.display = "block";
      });
  }
});

btnSaveEdit.addEventListener("click", () => {
  let id = btnSaveEdit.dataset.id;
  let updatedContact = {
    name: editInputs[0].value,
    surname: editInputs[1].value,
    phone: editInputs[2].value,
    photo: editInputs[3].value,
  };

  if (
    !updatedContact.name.trim() ||
    !updatedContact.surname.trim() ||
    !updatedContact.phone.trim() ||
    !updatedContact.photo.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(updatedContact),
  }).then(() => {
    readContacts();
    editModal.style.display = "none";
  });
});
