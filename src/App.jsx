/* eslint-disable no-unused-vars */
import './App.css';
import React from 'react'
import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


import { Header } from './components/Header'
import { AddContact } from './components/AddContact';
import { EditContact } from './components/EditContact';
import { ContactList } from './components/ContactList';
import { ContactDetail } from './components/ContactDetail';
import api from './api/contact'

// whenever the value changes, the useEffect helps us to render the component again
function App() {
  // const contacts = [
  //   {
  //     id: "1",
  //     name: "Lakshay",
  //     email: "imlakshaykumar@gmail.com"
  //   },
  //   {
  //     id: "2",
  //     name: "Simon",
  //     email: "SamonPaul@gmail.com"
  //   },
  // ]

  // const LOCAL_STORAGE_KEY = 'contacts';
  let [contacts, setContacts] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  let [searchResults, setSearchResults] = useState([]);

  const addContactHandler = async (contact) => {
    // console.log(contact);

    const request = {
      id: uniqid(),
      ...contact,
    }

    const response = await api.post("/contacts", request)
    console.log(response.data);
    setContacts([...contacts, response.data])

    // setContacts([...contacts, { id: uniqid(), ...contact }])
    // setContacts([...contacts, contact])
    console.log(contact);
  }

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact)
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  }

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`)
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id
    })
    setContacts(newContactList)
  }

  // Retrive data from API
  const retriveContactsFromAPI = async () => {
    const response = await api.get("/contacts")
    return response.data; //this will get response in response.data
  }

  const searchHandler = (searchTerm) => {
    // console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      })
      setSearchResults(newContactList)
    }
    else {
      setSearchResults(contacts)
    }
  }

  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts)
    // console.log(retriveContacts);

    const getAllContacts = async () => {
      const allContacts = await retriveContactsFromAPI();
      if (allContacts) {
        setContacts(allContacts);
      }
    }

    getAllContacts();

  }, []);

  // useEffect(() => {
  //   if (contacts.length !== 0) {
  //     // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts))
  //   }
  // }, [contacts]);


  return (
    <div className='ui container'>
      <Router>
        <Header />
        <Switch>
          <Route
            path='/add'
            render={ (props) => (
              <AddContact
                { ...props }
                addContactHandler={ addContactHandler }
              />
            ) }
          />

          <Route
            path='/edit'
            render={ (props) => (
              <EditContact
                { ...props }
                updateContactHandler={ updateContactHandler }
              />
            ) }
          />

          <Route
            path='/'
            exact
            render={ (props) => (
              <ContactList
                { ...props }
                contacts={ searchTerm.length < 1 ? contacts : searchResults }
                getContactID={ removeContactHandler }
                term={ searchTerm }
                searchKeyword={ searchHandler }
              />
            ) } />

          <Route
            path="/contact/:id"
            component={ ContactDetail }
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
