import React, { useState, useEffect } from "react";

export default function Weather() {
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            navigator.geolocation.getCurrentPosition(function (position) {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
            });

            // console.log("Latitude is:", lat)
            // console.log("Longitude is:", long)

            await fetch(
                `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=fe1bd2e7771531629301e13fed18de59`
            )
                .then((res) => res.json())
                .then((result) => {
                    setData(result);
                    // console.log(result);
                });
        };
        fetchData();
    }, [lat, long]);

    return (
        <>
            <div className="text-md font-bold text-slate-600">Weather</div>
            <hr className="bg-slate-400 h-1 w-full my-4" />
            <ul>
                <li>Latitude : {lat}</li>
                <li>Longitude : {long}</li>
                <li>City : {data.name}</li>
                <li>Temprature : {data.main.temp}</li>
                <li>Sunrise : {new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN')}</li>
                <li>Sunset : {new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN')}</li>
                <li>Description : {data.weather[0].description}</li>
                <li>Humidity : {data.main.humidity}</li>
            </ul>
        </>
    );
}
