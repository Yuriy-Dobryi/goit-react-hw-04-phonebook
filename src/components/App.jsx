import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Notify } from 'notiflix';

import { ContactForm } from "./ContactForm/ContactForm";
import { Filter } from "./Filter/Filter";
import { ContactList } from "./ContactList/ContactList";
import styles from './App.module.css'

const CONTACTS_KEY = 'contacts';
const DEFAULT_CONTACTS = [
  { id: nanoid(), name: 'Rosie Simpson', number: '459-12-56' },
  { id: nanoid(), name: 'Rosie Sompson', number: '145-23-65' },
  { id: nanoid(), name: 'Hermione Kline', number: '443-89-12' },
  { id: nanoid(), name: 'Eden Clements', number: '645-17-79' },
  { id: nanoid(), name: 'Annie Copeland', number: '227-91-26' },
  { id: nanoid(), name: 'Jack Shepart', number: '345-53-81' },
]

export function App() {
  
  const [contacts, setContacts] = useState(() => {
    const localContacts =
      JSON.parse(localStorage.getItem(CONTACTS_KEY));
    return localContacts ? [...localContacts] : [];
  });

  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify([...contacts]));

    setStatus('pending');
    const isContactsEmpty = contacts.length === 0;

    if (isContactsEmpty) {
      setStatus('rejected');
      setFilter('');
    } else {
      setStatus('resolved');
    }
  }, [contacts]);
  
  function addContact(newContact) {
    const newContactName = newContact.name.toLocaleLowerCase();
    const isNewContactExist = contacts.some(({ name }) =>
      name.toLocaleLowerCase() === newContactName);
    
    if (isNewContactExist) {
      Notify.failure(`${newContact.name} is already in contacts.🧐`)
      return;
    }
    
    setContacts(prev => [...prev, newContact]);
    showOperationMessage(newContact.name, 'added');
  }

  function setDefaultContacts() {
    setContacts([...DEFAULT_CONTACTS]);
  }

  function removeContact(id, name) {
    const updatedContacts = contacts.filter((contact) =>
      contact.id !== id);

    setContacts([...updatedContacts]);
    showOperationMessage(name, 'removed')
    checkEmptyContacts(updatedContacts.length, 'remove');
  }

  function showOperationMessage(contactName, typeOperation) {
    Notify.success(`${contactName} has been ${typeOperation}`)
  }

  function checkEmptyContacts(contactsCount, typeOperation) {
    if (contactsCount === 0) {
      Notify.info(typeOperation === 'remove'
        ? 'You deleted all contacts🙄'
        : 'No contacts with this name🤔');
    }
  }

  function filterContacts() {
    const modifiedFilter = filter.toLocaleLowerCase();

    return filter
      ? contacts.filter(({ name }) => name.toLocaleLowerCase().includes(modifiedFilter))
      : contacts
  }
  
  return (
    <div className="container">
      <div className={styles.phonebook}>
        <h1 className={styles.title}>Phonebook</h1>
        <ContactForm addContact={addContact} />
      </div>

      <div>
        <h2 className={styles.title}>Contacts</h2>
        {status === 'resolved' &&
          <>
            <Filter
              filter={filter}
              setFilter={setFilter} />
            <ContactList
              contacts={filterContacts()}
              removeContact={removeContact} />
          </>
        }
        
        {status === 'rejected' &&
          <>
            <p>There is no contacts</p>
            <button className={styles.btn} onClick={setDefaultContacts}>
              Default Contacts
            </button>
          </>
        }
      </div>
    </div>
  )
}