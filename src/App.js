import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import axios from "axios";

import './App.css';

export default function App() {

  const [postalCode, setPostalCode] = useState({ value: "1066PL", send: false })
  const [data, setData] = useState()

  const [load, setLoad] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (postalCode.send) {
      axios
        .get(`https://www.ah.nl//service/rest/kies-moment/bezorgen/${postalCode.value}`)
        .then(res => {
          setData(res.data['_embedded']['lanes']['3']['_embedded']['items']['0']['_embedded'])
          setLoad(true)
        })
        .catch(err => {
          setError(err.message)
          setLoad(true)
        })
    }
    return () => { setPostalCode({ ...postalCode, send: false }) }

  }, [postalCode.send])

  const changePostalCode = (e) => {
    e.preventDefault()
    setPostalCode({ ...postalCode, value: e.target.value.replace(/\s+/g, '') })
  }
  const sendRequestToAh = (e) => {
    e.preventDefault()
    setPostalCode({ ...postalCode, send: true })
  }


  console.log("Delivery", data, postalCode)
  if (!data) {
    return (
      <div className="App">
        <div className="app-postal-code">
          <label>Please insert your postal code:  <input type="text" onChange={e => changePostalCode(e)} placeholder={postalCode.value} /></label>
          <button onClick={e => sendRequestToAh(e)}>Ask to AH</button>
        </div>
      </div>
    )
  } else if (!load) {
    return (
      <div>
        Loading...
      </div>
    )
  } else if (data && load && !error) {
    const deliveryDates = data.deliveryDates.filter(res => res.deliveryTimeSlots.length > 1)
    // const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.map(filt => filt.state) !== "full")
    const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.map(filt => filt.state) === "full")
    console.log(deliveryDates, "DD", emptyDates)
    return (
      <div>
        {postalCode.value}'s Result
        <>
          <button onClick={e => sendRequestToAh(e)}>refresh</button>
          <button onClick={e => setData(null)}>Go back</button>
        </>
        <div style={{ color: "red" }}>
          {emptyDates.map((res, index) => <p key={index}>{res.date}: {res.deliveryTimeSlots.map((res, ind) => <li key={ind}>{res.from}-{res.to}  {res.state}</li>)}<br /></p>)}
        </div>
        <div>
          {deliveryDates.map((res, index) => <p key={index}>{res.date}: {res.deliveryTimeSlots.map((res, ind) => <li key={ind}>{res.from}-{res.to}  {res.state}</li>)}<br /></p>)}
        </div>
      </div>
    )
  } else {
    return (
      <div>
        There is a problem
      </div>
    )
  }

}
// async function fetchData() {
  // const result = await axios(`https://www.ah.nl//service/rest/kies-moment/bezorgen/1066PL`)
  // setData(result.data)
// }

    // async function fetchData() {
    // const result = await axios(`https://www.ah.nl//service/rest/kies-moment/bezorgen/${postalCode.value}`)
    // const result = await axios(`https://www.ah.nl//service/rest/kies-moment/bezorgen/1066PL`)
    // if (result) { setData("a") }
    // console.log("RESULT", result.data['_embedded']['lanes']['3']['_embedded']['items']['0']['_embedded'], data)
    // }

    // setDeliveryDates(data.find(res => res.deliveryTimeSlots.length > 1))