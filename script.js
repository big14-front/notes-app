const noteForm = document.querySelector(".note-form");
const noteTitle = document.querySelector("#note-title");
const noteContent = document.querySelector("#note-content");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector(".notes-list");
const favoriteFilter = document.querySelector("#favorite-filter");
const messagesBox = document.querySelector(".messages-box");

const colors = {
    red: "#ff6b6b",
    green: "#51cf66",
    blue: "#4dabf7",
    yellow: "#ffd43b",
    purple: "#9775fa"
};

let notes = [];
let nextNoteId = 1;

function showMessage(text, type = "success") {
    const message = document.createElement("div");
    const icon = document.createElement("img");
    const messageText = document.createElement("span");

    message.classList.add("message", type);

    icon.src = type === "error"
        ? "images/warning.svg"
        : "images/Done.svg";

    icon.alt = "";
    icon.classList.add("message-icon");

    messageText.textContent = text;

    message.append(icon, messageText);
    messagesBox.append(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

function renderNotes() {
    notesList.innerHTML = "";

    const visibleNotes = favoriteFilter.checked
        ? notes.filter(note => note.favorite)
        : notes;

    visibleNotes.forEach(note => {
        const card = document.createElement("li");
        card.classList.add("note-card");
        card.dataset.id = note.id;

        const header = document.createElement("div");
        header.classList.add("note-card-header");
        header.style.backgroundColor = colors[note.color] || colors.yellow;

        const title = document.createElement("h3");
        title.classList.add("note-card-title");
        title.textContent = note.title;

        const actions = document.createElement("div");
        actions.classList.add("note-card-actions");

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.dataset.action = "favorite";
        favoriteButton.dataset.id = note.id;
        favoriteButton.setAttribute(
            "aria-label",
            note.favorite ? "Убрать из избранного" : "Добавить в избранное"
        );
        favoriteButton.setAttribute("aria-pressed", String(note.favorite));

        const favoriteIcon = document.createElement("img");
        favoriteIcon.src = note.favorite
            ? "images/heart-active.svg"
            : "images/heart.svg";
        favoriteIcon.alt = "";

        favoriteButton.append(favoriteIcon);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = note.id;
        deleteButton.setAttribute("aria-label", "Удалить заметку");

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "images/trash.svg";
        deleteIcon.alt = "";

        deleteButton.append(deleteIcon);

        actions.append(favoriteButton, deleteButton);
        header.append(title, actions);

        const body = document.createElement("div");
        body.classList.add("note-card-body");

        const content = document.createElement("p");
        content.classList.add("note-card-content");
        content.textContent = note.content;

        body.append(content);
        card.append(header, body);
        notesList.append(card);
    });

    noteCount.textContent = notes.length;
}

noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
        showMessage("Заполните все поля", "error");
        return;
    }

    if (title.length > 50) {
        showMessage(
            "Максимальная длина заголовка — 50 символов",
            "error"
        );
        return;
    }

    const selectedColor = document.querySelector(
        'input[name="color"]:checked'
    );

    const note = {
        id: nextNoteId++,
        title: title,
        content: content,
        color: selectedColor ? selectedColor.value : "yellow",
        favorite: false
    };

    notes.push(note);

    noteForm.reset();

    const defaultColor = document.querySelector(
        'input[name="color"][value="yellow"]'
    );

    if (defaultColor) {
        defaultColor.checked = true;
    }

    renderNotes();
    showMessage("Заметка добавлена!", "success");
});

notesList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const noteId = Number(button.dataset.id);
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return;
    }

    if (button.dataset.action === "favorite") {
        notes[noteIndex].favorite = !notes[noteIndex].favorite;
        renderNotes();
    }

    if (button.dataset.action === "delete") {
        notes.splice(noteIndex, 1);
        renderNotes();
        showMessage("Заметка удалена!", "success");
    }
});

favoriteFilter.addEventListener("change", renderNotes);

renderNotes();
