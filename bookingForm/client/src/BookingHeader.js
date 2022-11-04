import { height } from "@mui/system";
import React from "react";
import Logo from "./Logo";

export default () => {
  return (
    <div style={{ marginBottom: 10 }}>
      <h1 className="h1">
      EFFETTUA UNA 
      </h1>
      <h1 className="h1color">
      &nbsp;PRENOTAZIONE
      </h1>
      <p className="fieldInfo" style={{ fontSize: 14, lineHeight: 1.3}}>
        I campi contrassegnati con * sono obbligatori
      </p>
    </div>
  );
};
