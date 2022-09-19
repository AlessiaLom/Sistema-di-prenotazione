import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles.css"
import { BrowserRouter, Route } from "react-router-dom"
import Booking from "./pages/Booking"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)