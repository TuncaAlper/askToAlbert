import React, { useState, useEffect } from 'react';
import axios from "axios";

import './landingPage.css';
import Timer from './timer';
import LoadSpinner from './loadSpinner';

export default function LandingPage() {

    const [postalCode, setPostalCode] = useState({ value: "", send: false });
    const [reqTime, setReqTime] = useState(5);
    const [data, setData] = useState();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [pageError, setPageError] = useState(false);

    useEffect(() => {
        if (postalCode.send) {
            setLoading(true)
            axios
                .get(`https://www.ah.nl//service/rest/kies-moment/bezorgen/${postalCode.value}`)
                .then(res => {
                    setData(res.data['_embedded']['lanes']['3']['_embedded']['items']['0']['_embedded'])
                    setLoading(false)
                    setPostalCode(prevState => ({
                        ...prevState,
                        send: false
                    }))
                })
                .catch(err => {
                    setError(err.message)
                    setLoading(false)
                })
        }
    }, [postalCode.send, postalCode.value])


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
            setPostalCode(prevState => ({ ...prevState, send: true }))
            setPageError(false)
        } else {
            setPageError(true)
        }
    }
    const goBackButton = (e) => {
        e.preventDefault()
        setData(null)
    }
    const handlePostalSend = () => {
        setPostalCode(prevState => ({ ...prevState, send: true }))
    }


    if (loading) {
        return (
            <div className="Landing" >
                <LoadSpinner style={{ margin: '25vmin' }} />
            </div>
        )
    } else if (!data) {
        return (
            <div className="Landing">
                <div className="landing-postal-code">
                    <label>Please insert your postal code:  <input type="text" onChange={e => changePostalCode(e)} placeholder={postalCode.value} /></label>
                    <br />
                    <label>Refresh time in minutes: <input type="num" onChange={e => changeReqTime(e)} placeholder={reqTime} /></label>
                    <br />
                    <button className="button-blue" onClick={e => sendRequestToAh(e)}>Ask to Albert</button>
                    <p>advised refresh time is 5min.</p>
                    {pageError && <p style={{ color: "red" }}>Please type your Postal Code!</p>}
                    <div className="landing-footer" >
                        <p>
                            Created by Alper Tunca
                            <br />
                            to Contact, alpertunca@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        )
    } else if (data && !loading && !error) {

        const deliveryDates = data.deliveryDates.filter(res => res.deliveryTimeSlots.length > 1)
        // const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.map(filt => filt.state).includes("selectable"))
        const emptyDates = deliveryDates.filter(res => res.deliveryTimeSlots.some(filt => filt.state === "selectable"))

        // const emptyDatesNew = deliveryDates.filter(res => res.deliveryTimeSlots.filter(filt => filt.state).includes("selectable"))


        return (
            <div className="Landing">
                <h2>
                    {postalCode.value}'s Result
        <br />
                    <button className="button-blue" onClick={e => goBackButton(e)}>Go back</button>
                    <button className="button-blue" onClick={e => sendRequestToAh(e)}>Refresh</button>

                </h2>
                <Timer
                    reqTime={reqTime}
                    handlePostalSend={handlePostalSend}
                />
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
                {console.log(error, "Error")}
            </div>
        )
    }
}
