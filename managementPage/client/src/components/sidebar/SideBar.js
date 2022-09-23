import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MenuItem from './MenuItem';
import Footer from './../Footer';
import "./../../styles/sideBar.css"

/**
 * The SideBar represents the side navigation bar menu 
 */
export default class SideBar extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - activeItemIndex: passed by the App to make the SideBar change the class of the MenuItem so that bootstrap can style the active one differently from th other ones
         *      - onClick: the App's changeContent(i) function used to change content dependently on the index of the selected MenuItem
         */
        super(props)
    }

    render() {
        return (
            <>
            <ul className="nav nav-pills flex-column mb-auto">
                <MenuItem
                    itemName="customize"
                    className={"nav-link"}
                    itemIcon="bi bi-brush"
                    itemDisplayName="Personalizza"
                    onClick={() => this.props.onClick(0)} />
                <MenuItem
                    itemName="activities"
                    className={"nav-link"}
                    itemIcon="bi bi-calendar-range"
                    itemDisplayName="Attività"
                    onClick={() => this.props.onClick(1)} />
                <MenuItem
                    itemName="bookings"
                    className={"nav-link"}
                    itemIcon="bi bi-person-check"
                    itemDisplayName="Prenotazioni"
                    onClick={() => this.props.onClick(2)} />
                <MenuItem
                    itemName="services"
                    className={"nav-link"}
                    itemIcon="bi bi-share"
                    itemDisplayName="Servizi"
                    onClick={() => this.props.onClick(3)} />
                <MenuItem
                    itemName="account"
                    className={"nav-link"}
                    itemIcon="bi bi-gear-wide-connected"
                    itemDisplayName="Account"
                    onClick={() => this.props.onClick(4)} />
            </ul><Footer
                restaurantId={this.props.restaurantId}
                onLogout={this.props.onLogout}/></>
        )
    }
}