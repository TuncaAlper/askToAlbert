import React, { useState, useEffect } from 'react'

export default function Timer(props) {

    const [timeCount, setTimeCount] = useState({ minutes: props.reqTime, seconds: 0 })

    useEffect(() => {
        if (timeCount.minutes === 0 && timeCount.seconds === 0) {
            return props.handlePostalSend()
        }

        const myInterval = setInterval(() => {
            const { minutes, seconds } = timeCount

            if (seconds > 0) {
                return setTimeCount(prevState => ({ ...prevState, seconds: seconds - 1 }))
            } else if (seconds === 0 && minutes === 0) {
                return clearInterval(myInterval)
            } else {
                return setTimeCount(prevState => ({ ...prevState, minutes: minutes - 1, seconds: 59 }))
            }
        }, 1000)

        return () => {
            clearInterval(myInterval)
        }
    })

    return (
        <div style={{ textAlign: "left" }}>
            <p>Time Remaining to refresh: {timeCount.minutes}:{timeCount.seconds < 10 ? `0${timeCount.seconds}` : timeCount.seconds}</p>
        </div>
    )
}

