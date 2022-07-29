import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import TextForm from './TextForm';

export default class Customize extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{width: "100%", margin: "1%", padding: "1%"}}>
                <div className="d-block input-group mb-3">
                    <h4>Info del ristorante</h4>
                    <h6> Nome </h6>
                    Il nome del ristorante verrà visualizzato sotto al logo
                    <TextForm id="customizationRestaurantName" placeholder="Inserisci il nome del ristorante" />
                </div>
                <div className="d-block input-group mb-3">
                    <h6> Info aggiuntive</h6>
                    In questa sezione potrai personalizzare il messaggio visualizzato sotto il nome del ristorante ed il logo, per esempio con una frase di benvenuto.
                    <TextForm id="customizationMoreInfo" placeholder="Inserisci informazioni aggiuntive" />
                </div>
                <hr></hr>
                <div className="d-block input-group mb-3">
                    <h4>Tema colore</h4>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Rosso
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" ></input>
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Blu
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" ></input>
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Viola
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" ></input>
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Nero
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" ></input>
                        <input  type="text" className="form-control" placeholder="Codice RGB" aria-label="Codice RGB"
                            aria-describedby="basic-addon2"></input>
                    </div>
                </div>
                <hr></hr>
                <div className="d-block input-group mb-3">
                    <h4>Logo del ristorante</h4>
                    <div className="input-group mb-3">
                        <input  type="file" className="form-control" id="inputGroupFile02"></input>
                    </div>
                </div>
                <hr></hr>
                <div style={{ margin: "15 %", padding: "1 %", margin: "0", border: "0" }}>
                    <button type="button" className="btn btn-light">Annulla</button>
                    <button type="button" className="btn btn-primary">Salva modifiche</button>
                </div>
            </div>
        )
    }
}