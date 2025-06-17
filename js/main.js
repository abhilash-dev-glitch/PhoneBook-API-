// Simulated in-memory contacts DB
let contacts = [
    { id: 1, name: "Alice Smith", phone: "123-456-7890" },
    { id: 2, name: "Bob Johnson", phone: "234-567-8901" }
];
let nextId = 3;

const addForm = document.getElementById('addContactForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const searchInput = document.getElementById('searchInput');
const contactsContainer = document.getElementById('contactsContainer');

// Simulate async fetch all contacts
async function fetchContacts() {
    return new Promise(resolve => {
        setTimeout(() => {
            renderContacts();
            resolve();
        }, 200);
    });
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

// Add contact (Fake API)
addForm.onsubmit = async function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (!name || !phone) return;
    // Simulate async add
    await new Promise(resolve => setTimeout(resolve, 200));
    contacts.push({ id: nextId++, name, phone });
    nameInput.value = "";
    phoneInput.value = "";
    await fetchContacts();
};

// Delete contact (Fake API)
contactsContainer.onclick = async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        if (!confirm('Delete this contact?')) return;
        // Simulate async delete
        await new Promise(resolve => setTimeout(resolve, 200));
        contacts = contacts.filter(c => c.id !== id);
        await fetchContacts();
    }
};

// Search live
searchInput.oninput = function() {
    renderContacts();
};

// Initial load
fetchContacts();
