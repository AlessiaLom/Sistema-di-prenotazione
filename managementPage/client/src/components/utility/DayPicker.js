import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"

/**
 * The DayPicker component is used to select the days a certain activiy takes places for a restaurant
 */
export default class DayPicker extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>
                <span className="validationError">{this.props.validationError}</span>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="L"
                        checked={this.props.checkedOnes.includes("L") ? true : false}></input>
                    <label className="form-check-label" >L</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="Ma"
                        checked={this.props.checkedOnes.includes("Ma") ? true : false}></input>
                    <label className="form-check-label" >Ma</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="Me"
                        checked={this.props.checkedOnes.includes("Me") ? true : false}></input>
                    <label className="form-check-label" >Me</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="G"
                        checked={this.props.checkedOnes.includes("G") ? true : false}></input>
                    <label className="form-check-label" >G</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="V"
                        checked={this.props.checkedOnes.includes("V") ? true : false}></input>
                    <label className="form-check-label" >V</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="S"
                        checked={this.props.checkedOnes.includes("S") ? true : false}></input>
                    <label className="form-check-label" >S</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="D"
                        checked={this.props.checkedOnes.includes("D") ? true : false}></input>
                    <label className="form-check-label" >D</label>
                </div>
            </div>
        )
    }
}