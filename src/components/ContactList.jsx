import { ContactCard } from "./ContactCard";
import { Link } from 'react-router-dom';
import { useRef } from "react";

export const ContactList = (props) => {
    const inputEl = useRef("");

    const deleteContactHandler = (id) => {
        props.getContactID(id)
    };

    const renderContactList = props.contacts.map((contact) => {
        return (
            <ContactCard
                contact={ contact }
                clickHandler={ deleteContactHandler }
                key={ contact.id } />
        );
    })

    const getSearchTerm = () => {
        // console.log(inputEl.current.value);
        props.searchKeyword(inputEl.current.value)
    }
    return (
        <div style={ { paddingTop: '5em' } } className="main">
            <h2>
                Contact List
                <Link to="/add">
                    <button className="ui button blue" style={ { float: 'right' } }>Add Contact</button>
                </Link>
            </h2>

            <div className="ui search">
                <div className="ui icon input">
                    <input
                        ref={ inputEl }
                        type="text"
                        placeholder="Search contacts"
                        className="prompt"
                        value={ props.term }
                        onChange={ getSearchTerm } />
                    <i className="search icon"></i>
                </div>
            </div>

            <div className="ui celled list">
                {
                    renderContactList.length > 0 ?
                        renderContactList : "No Contacts Available"
                }
            </div>
        </div>
    )
}
