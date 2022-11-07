import React from "react";

export default () => {
  return (
    <div className="cancelationHeader" style={{ marginBottom: 10}}>
      <h1 className="h1canc">
        Cancella una prenotazione
      </h1>
      <p className="fieldInfoCanc" style={{ fontSize: 14, lineHeight: 1.3}}>
        I campi contrassegnati con * sono obbligatori
      </p>
    </div>
  );
};
