import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/sideBar.css"

/**
 * The MenuItem represents one of the options of the menu
 */
export default class MenuItem extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - itemName: name of the <a> element
         *      - className: name of the class of the <a> element
         *      - onClick: function triggered onClick, it will trigger the App function used to highlight the active menu link and to change content.
         *                  the function is passed to the MenuItem component through the SideBar component
         *      - itemIcon: name of the bootstrap class of the icon
         *      - itemDisplayName: what is displayed as the name of the menu option (es. Personalizzazione)
         */
        super(props)
    }

    render() {
        return (
            <li className="nav-item">
                <a href="#" name={this.props.itemName} className={this.props.className} aria-current="page" onClick={this.props.onClick}>
                    <i className={this.props.itemIcon}></i>
                    {this.props.itemDisplayName}
                </a>
            </li>
        )
    }
}