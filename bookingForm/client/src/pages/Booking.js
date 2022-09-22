import BookingForm from "../BookingForm";

export default function Booking(props) {
    return (
      <>
        <BookingForm restaurantId={props.restaurantId}/>
      </>
    );
  }