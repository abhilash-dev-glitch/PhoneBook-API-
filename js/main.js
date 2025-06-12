const API_URL = 'http://localhost:3000/contacts';

const addForm = document.getElementById('addContactForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const searchInput = document.getElementById('searchInput');
const contactsContainer = document.getElementById('contactsContainer');

let contacts = [];

// Fetch all contacts from API
async function fetchContacts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        contacts = await res.json();
        renderContacts();
    } catch (err) {
        contactsContainer.innerHTML = `<div style="text-align:center;color:#b00;padding:24px 0;">${err.message}</div>`;
    }
}

// Group contacts A-Z
function groupContactsAZ(list) {
    const map = {};
    list.forEach(contact => {
        const letter = /^[A-Z]/i.test(contact.name) ? contact.name[0].toUpperCase() : '#';
        if (!map[letter]) map[letter] = [];
        map[letter].push(contact);
    });
    return map;
}

// Render contacts
function renderContacts() {
    const search = searchInput.value.trim().toLowerCase();
    let filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search)
    );
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    const grouped = groupContactsAZ(filtered);
    const az = Object.keys(grouped).sort();

    contactsContainer.innerHTML = '';
    if (filtered.length === 0) {
        contactsContainer.innerHTML = `<div style="text-align:center;color:#aaa;padding:24px 0;font-size:1.1em;">No contacts found.</div>`;
        return;
    }
    az.forEach(letter => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'az-group';
        const header = document.createElement('div');
        header.className = 'az-header';
        header.textContent = letter;
        groupDiv.appendChild(header);
        grouped[letter].forEach(contact => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <div class="contact-info">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-phone">📞 ${contact.phone}</span>
                </div>
                <button class="delete-btn" data-id="${contact.id}">Delete</button>
            `;
            groupDiv.appendChild(card);
        });
        contactsContainer.appendChild(groupDiv);
    });
}

// Add contact (API)
addForm.onsubmit = async function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (!name || !phone) return;
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, phone })
        });
        if (!res.ok) throw new Error('Failed to add contact');
        nameInput.value = "";
        phoneInput.value = "";
        await fetchContacts();
    } catch (err) {
        alert('Error: ' + err.message);
    }
};

// Delete contact (API)
contactsContainer.onclick = async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        if (!confirm('Delete this contact?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchContacts();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }
};

// Search live
searchInput.oninput = function() {
    renderContacts();
};

// Initial load
fetchContacts();