import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import {Link, useResolvedPath, useMatch} from "react-router-dom";
import "./../../styles/sideBar.css"

/**
 * The MenuItem represents one of the options of the menu
 */
export default function MenuItem(props) {
    return (
        <CustomLink to={"/" + props.itemName} className={props.className}><i className={props.itemIcon}></i>{props.itemDisplayName}</CustomLink>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "nav-item active" : "nav-item"}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}