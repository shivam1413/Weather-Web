import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import "./SearchBox.css";

export default function SearchBox({ updateInfo }) {
    const [city, setCity] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("error");

    const API_URL = "http://api.openweathermap.org/geo/1.0/direct";
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "d2fce59dbae8bf426f126aa1a92e037e";
    
    const getWeatherInfo = async () => {
        try {
            const response = await fetch(`${API_URL}?q=${city}&limit=1&appid=${API_KEY}`);
            const jsonResponse = await response.json();

            if (jsonResponse.length > 0) {
                const { lat, lon } = jsonResponse[0];
                const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const weatherData = await weatherResponse.json();

                const result = {
                    city: city,
                    temp: weatherData.main.temp,
                    tempMin: weatherData.main.temp_min,
                    tempMax: weatherData.main.temp_max,
                    humidity: weatherData.main.humidity,
                    feelsLike: weatherData.main.feels_like,
                    weather: weatherData.weather[0].description,
                };

                console.log(result);
                return result;
            } else {
                setAlertMessage(`City "${city}" not found. Please enter a valid city name.`);
                setSeverity("warning");
                setOpenSnackbar(true);
                return null;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setAlertMessage("An error occurred while fetching weather data. Please try again.");
            setSeverity("error");
            setOpenSnackbar(true);
            return null;
        }
    };

    const handleChange = (evt) => {
        setCity(evt.target.value);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const newInfo = await getWeatherInfo();
        if (newInfo) {
            updateInfo(newInfo);
        }
        setCity("");
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div className='searchbox'>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Enter city" 
                    variant="outlined" 
                    value={city} 
                    onChange={handleChange} 
                    required 
                />
                <Button type="submit" variant="contained" color="primary">
                    Search
                </Button>
            </form>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
