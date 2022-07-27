import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"

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
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="LCheckbox" value="optionL"></input>
                        <label className="form-check-label" >L</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="MaCheckbox" value="optionMa"></input>
                        <label className="form-check-label" >Ma</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="MeCheckbox" value="optionMe"></input>
                        <label className="form-check-label" >Me</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="GCheckbox" value="optionG"></input>
                        <label className="form-check-label" >G</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="VCheckbox" value="optionV"></input>
                        <label className="form-check-label" >V</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="SCheckbox" value="optionS"></input>
                        <label className="form-check-label" >S</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="DCheckbox" value="optionD"></input>
                        <label className="form-check-label" >D</label>
                </div>
            </div>
        )
    }
}