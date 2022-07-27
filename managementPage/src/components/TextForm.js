import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import $ from 'jquery';

/**
 * Represents an input text area
 */
export default class TextForm extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - placeholder: the placeholder of the input text area
         */
        super(props)
    }

    render() {
        return (
            <div className="form-group">
                <input type="text" className="form-control" placeholder={this.props.placeholder}></input>
                <small className="form-text text-muted"></small>
            </div>
        )
    }
}