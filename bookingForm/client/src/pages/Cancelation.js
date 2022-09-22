import CancelationForm from "../CancelationForm"

export default function Cancelation(props) {
    return (
      <>
        <CancelationForm restaurantId={props.restaurantId}/>
      </>
    )
  }