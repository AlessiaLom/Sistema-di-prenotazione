import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles.css"
import { BrowserRouter } from "react-router-dom"

/**
 * Seatyzen renders the whole app 
 */
 class Seatyzen extends React.Component{
  constructor(props) {
      super(props)
  }

  render() {
      return (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Seatyzen />);