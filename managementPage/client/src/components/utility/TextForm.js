import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"

/**
 * Represents an input text area
 *
 * @param validationError error message, if empty doesn't display anything
 * @param value displayer value
 * @param name input type text name attribute
 * @param placeholder
 * @param onChange
 */
export default class TextForm extends React.Component {
    constructor(props) {
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