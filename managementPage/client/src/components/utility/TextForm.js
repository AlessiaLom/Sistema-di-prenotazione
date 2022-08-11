import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../../styles/pages.css"
import $ from 'jquery';

/**
 * Represents an input text area
 */
export default class TextForm extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - id: id of the html input element
         *      - placeholder: the placeholder of the input text area
         *      - validationError: contains the error message for wrong input, used to color the border of red
         */ 
        super(props)
    }

    render() {
        let className = "form-control" + (this.props.validationError ? " border-danger" : "")
        return (
            <>
                <span className="validationError">{this.props.validationError}</span>
                <input
                    value={this.props.value}
                    name={this.props.name}
                    type="text"
                    className={className}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    required>
                </input>
            </>
        )
    }
}