import React from 'react';
import Navbar from "./Navbar";
import Booking from "./pages/Booking";
import Cancelation from "./pages/Cancelation";
import Logo from "./Logo";
import { Route, Routes } from "react-router-dom";
import Footer from "./Footer";

const relativeURL = window.location.pathname;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        restaurantId: relativeURL.lastIndexOf('/') != 0 ? relativeURL.substring(relativeURL.indexOf('/') + 1 , relativeURL.lastIndexOf('/')) : relativeURL.substring(relativeURL.indexOf('/') + 1 , relativeURL.length),
    }
}

render(){
    return (
      <>
        <Logo />
        <Navbar restaurantId={this.state.restaurantId}/>
        <div className="container">
          <Routes>
            <Route path ={"/" + this.state.restaurantId} element={<Booking restaurantId={this.state.restaurantId} />} />
            <Route path={"/" + this.state.restaurantId + "/booking"} element={<Booking restaurantId={this.state.restaurantId} />} />
            <Route path={"/" + this.state.restaurantId + "/cancelation"} element={<Cancelation restaurantId={this.state.restaurantId} />} />
          </Routes>
        </div>
        <Footer />
      </>
    )
  }
}