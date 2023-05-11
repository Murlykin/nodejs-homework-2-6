const fs = require("fs/promises");

const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.find((item) => item.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const findContact = data.find((item) => item.id === contactId);
  if (!findContact) {
    return null;
  }
  const contacts = data.filter((item) => item.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return findContact;
};

const addContact = async (data) => {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      ...data,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  if (!contact) {
    return null;
  }

  const changeContact = { ...contact, ...body };
  const newContacts = contacts.filter((item) => item.id !== contactId);
  newContacts.push(changeContact);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return changeContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
