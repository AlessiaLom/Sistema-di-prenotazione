import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select"
import HeaderForm from "./HeaderForm";
import DatePicker from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css'

export function Form() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");
  const [date, handleDateSelect, handleDateChange] = useState(new Date());
  const options = [
    { value: '12:00', label: '12:00' },
    { value: '12:15', label: '12:15' },
    { value: '12:30', label: '12:30' },
    { value: '12:45', label: '12:45' },
    { value: '13:00', label: '13:00' },
    { value: '13:15', label: '13:15' },
    { value: '13:30', label: '13:30' },
    { value: '13:45', label: '13:45' },
    { value: '14:00', label: '14:00' },
    { value: '19:00', label: '19:00' },
    { value: '19:15', label: '19:15' },
    { value: '19:30', label: '19:30' },
    { value: '19:45', label: '19:45' },
    { value: '20:00', label: '20:00' },
    { value: '20:15', label: '20:15' },
    { value: '20:30', label: '20:30' },
    { value: '20:45', label: '20:45' },
    { value: '21:00', label: '21:00' },
  ];

  return (
    <form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
      <HeaderForm />
      <label>Data di prenotazione* <DatePicker selected={date} onSelect={handleDateSelect} onChange={handleDateChange} dateFormat="dd-MM-yyyy" minDate={new Date()} required/></label>
      <label>Ora di prenotazione* <Select options={options} theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: 'hotpink',
                                                                primary: 'black',
                                                            },})}placeholder="Seleziona un orario" /></label>
      <label>Numero di coperti* <input type="number" placeholder="Inserisci i coperti" {...register("bookingGuests", {required: true, max: 20, min: 1})} /></label>
      <label>Nome* <input type="text" placeholder="Inserisci il nome" {...register("guestName", {required: true})} /></label>
      <label>Cognome* <input type="text" placeholder="Inserisci il cognome" {...register("guestSurname", {required: true})} /></label>
      <label>Email* <input type="text" placeholder="Inserisci la mail" {...register("guestEmail", {required: true, pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i})} /></label>
      <label>Numero di cellulare* <input type="tel" placeholder="Inserisci il cellulare" {...register("guestPhone", {required: true})} /></label>
      <label>Informazioni aggiuntive <textarea placeholder="Scrivi qui..." {...register("guestAdditionalInformation", {maxLength: 1000})} /></label>
      <input type="checkbox" id="guestPrivacy" {...register("guestPrivacy", {required: true})} />
      <label id="privacyLabel" htmlFor="guestPrivacy">Acconsento al trattamento dei dati personali*</label>
      <input type="submit" value="Invia" />
    </form>
  );
}
