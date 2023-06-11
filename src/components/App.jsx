import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { Notify } from 'notiflix';

import styles from './App.module.css'
import { ContactForm } from "./ContactForm/ContactForm";
import { Filter } from "./Filter/Filter";
import { ContactList } from "./ContactList/ContactList";

const DEFAULT_CONTACTS = [
  { id: nanoid(), name: 'Rosie Simpson', number: '459-12-56' },
  { id: nanoid(), name: 'Rosie Sompson', number: '145-23-65' },
  { id: nanoid(), name: 'Hermione Kline', number: '443-89-12' },
  { id: nanoid(), name: 'Eden Clements', number: '645-17-79' },
  { id: nanoid(), name: 'Annie Copeland', number: '227-91-26' },
  { id: nanoid(), name: 'Jack Shepart', number: '345-53-81' },
]

const CONTACTS_KEY = 'contacts';

export function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const [status, setStatus] = useState('idle');
  const isFirstRender = useRef(true);

  useEffect(() => {
    const localContacts = JSON.parse(localStorage.getItem(CONTACTS_KEY));
    setStatus('pending');
    
    setTimeout(() => {
      if (localContacts && localContacts.length > 0) {
        setContacts([...localContacts]);
        setStatus('resolved');
      } else {
        setStatus('rejected');
      }

    }, 250);

  }, []);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus('pending');
    const isContactsEmpty = contacts.length === 0;

    setTimeout(() => {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify([...contacts]));
      
      if (isContactsEmpty) {
        setStatus('rejected');
        setFilter('');
      } else {
        setStatus('resolved');
      }
      
    }, 250);

  }, [contacts]);
  
  function addContact(newContact) {
    const newContactName = newContact.name.toLocaleLowerCase();
    const isNewContactExist = contacts.some(({ name }) =>
      name.toLocaleLowerCase() === newContactName);
    
    if (isNewContactExist) {
      Notify.failure(`${newContact.name} is already in contacts.🧐`)
      return;
    }

    setContacts([...contacts, newContact]);
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
  
  const filteredContacts = filterContacts();
  
  return (
    <div className="container">
      <div className={styles.phonebook}>
        <h1 className={styles.title}>Phonebook</h1>
        <ContactForm
          addContact={addContact} />
      </div>

      <div>
        <h2 className={styles.title}>Contacts</h2>
        {status === 'pending' &&
          <p>Loading . . .</p>}

        {status === 'resolved' &&
          <>
            <Filter
              filter={filter}
              setFilter={setFilter} />
            <ContactList
              contacts={filteredContacts}
              removeContact={removeContact} />
          </>}
        
        {status === 'rejected' &&
          <>
            <p>There is no contacts</p>
            <button className={styles.btn} onClick={setDefaultContacts}>
              Default Contacts
            </button>
          </>}
      </div>
    </div>
  )
}