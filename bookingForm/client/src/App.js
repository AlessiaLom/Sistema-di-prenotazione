import React from 'react';
import Navbar from "./Navbar";
import Booking from "./pages/Booking";
import Cancelation from "./pages/Cancelation";
import Logo from "./Logo";
import { Route, Routes } from "react-router-dom";
import Footer from "./Footer";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        restaurantId: '4b0eb8ef-385d-4a8c-b8c9-21a1bf2ddae6',
    }
}

render(){
    return (
      <>
        <Logo />
        <Navbar />
        <div className="container">
          <Routes>
            <Route path ="/" element={<Booking restaurantId={this.state.restaurantId} />} />
            <Route path="/booking" element={<Booking restaurantId={this.state.restaurantId} />} />
            <Route path="/cancelation" element={<Cancelation restaurantId={this.state.restaurantId} />} />
          </Routes>
        </div>
        <Footer />
      </>
    )
  }
}