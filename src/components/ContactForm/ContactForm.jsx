import { Component } from "react";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import styles from '../App.module.css';

const defaultState = {
  name: '',
  number: '',
}

export class ContactForm extends Component {
  state = {
    name: '',
    number: '',
  }
  
  inputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  submitClick = (e) => {
    e.preventDefault();
    const { addContact } = this.props;
    const { name, number } = this.state;
    const newContact = { id: nanoid(), name, number }

    addContact(newContact)
    this.setState({ ...defaultState });
  }

  render() {
    const { name, number } = this.state;

    return (
      <form onSubmit={this.submitClick}>
        
        <label>
          Name
          <input className={styles.input}
            onChange={this.inputChange}
            value={name}
            type="text"
            name="name"
            pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
            title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
            required
          />
        </label>

        <label>
          Number
          <input className={styles.input}
            onChange={this.inputChange}
            value={number}
            type="tel"
            name="number"
            pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
            title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
            required
          />
        </label>

        <button className={styles.btn} type="submit">Add contact</button>
      </form>
    )
  }
}

ContactForm.propTypes = {
  addContact: PropTypes.func.isRequired,
};