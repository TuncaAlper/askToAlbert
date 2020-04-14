import React, { useState, useEffect } from 'react';
import axios from "axios";

import './App.css';

export default function App() {

  const [postalCode, setPostalCode] = useState({ value: "", send: false })
  const [reqTime, setReqTime] = useState(5);
  const [data, setData] = useState()
  const [count, setCount] = useState(0)

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

      return () => {
        setPostalCode(prevState => ({
          ...prevState,
          send: false
        }))
      }
    }

    if (data) {
      const interval = setInterval(() => {
        setPostalCode(prevState => ({ ...prevState, send: true }))
      }, 1000 * 60 * reqTime)

      return () => {
        clearInterval(interval)
      }
    }
  }, [postalCode.send, postalCode.value, data, reqTime])

  // useEffect(() => {
  //   if (data) {
  //     const interval = setInterval(() => {
  //       setPostalCode({ ...postalCode, send: true })
  //     }, 1000 * 60)

  //     return () => {
  //       clearInterval(interval)
  //     }
  //   }
  // }, [data])

  const changePostalCode = (e) => {
    e.preventDefault()
    setPostalCode({ ...postalCode, value: e.target.value.replace(/\s+/g, '') })
  }
  const changeReqTime = (e) => {
    e.preventDefault()
    setReqTime(e.target.value)
  }
  const sendRequestToAh = (e) => {
    e.preventDefault()
    if (!!postalCode.value && !!reqTime) {
      setPostalCode({ ...postalCode, send: true })
      setCount(count + 1)
    } else {
      alert("Please type your Postal Code")
    }
  }
  const goBackButton = (e) => {
    e.preventDefault()
    setData(null)
    setCount(0)
  }

  if (!data) {
    return (
      <div className="App">
        <div className="app-postal-code">
          <label>Please insert your postal code:  <input type="text" onChange={e => changePostalCode(e)} placeholder={postalCode.value} /></label>
          <label>Refresh time in minutes: <input type="num" onChange={e => changeReqTime(e)} placeholder={reqTime} /></label>

          <button className="button-blue" onClick={e => sendRequestToAh(e)}>Ask to Albert</button>
          <p>advised refresh time is 5min.</p>
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
    // const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.map(filt => filt.state).includes("selectable"))
    const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.some(filt => filt.state === "selectable"))

    // const emptyDatesNew = deliveryDates.filter(res => res.deliveryTimeSlots.filter(filt => filt.state).includes("selectable"))


    return (
      <div className="App">
        <h2>
          {postalCode.value}'s Result
        <br />
          <button className="button-blue" onClick={e => goBackButton(e)}>Go back</button>
          <button className="button-blue" onClick={e => sendRequestToAh(e)}>Refresh</button>

        </h2>
        <h3 style={{ color: "black" }}>Available Dates..</h3>
        <div className="container-empty-date">
          {emptyDates.length > 0 ?
            emptyDates.map((res, index) =>
              <div key={index}>
                <h3>{res.date}: </h3> {res.deliveryTimeSlots.map((res, ind) =>
                  <div className="div-li-empty-date" key={ind}>
                    <li className="li-empty-date">
                      {
                        res.navItem ?
                          <a
                            href={'https://www.ah.nl' + res.navItem.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anchor-empty-date"
                          >
                            {res.from}-{res.to}  {res.state}
                          </a>
                          : 'full'
                      }
                    </li>
                  </div>
                )}
                <br />
              </div>
            ) : <h2 style={{ color: "red" }}>Could not find available date, yet :) </h2 >
          }
        </div>
        <div>
          <h3 style={{ color: "black" }}>All Dates..</h3>
          <div className="container-empty-date">
            {deliveryDates.map((res, index) =>
              <div key={index}>
                <h4>{res.date}: </h4> {res.deliveryTimeSlots.map((res, ind) =>
                  <div className="div-li-empty-date" key={ind}>
                    <li className="li-empty-date">
                      {res.from}-{res.to}  {res.state}
                    </li>
                  </div>
                )}
                <br />
              </div>)}
          </div>
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
