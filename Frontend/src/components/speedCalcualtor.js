import React, { createContext, useState, useEffect } from 'react';

export const SpeedContext = createContext();

export const SpeedProvider = ({ children }) => {
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        let previousPosition = null;
        let previousTime = null;

        function haversine(lat1, lon1, lat2, lon2) {
            const R = 6371e3;
            const φ1 = (lat1 * Math.PI) / 180;
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lon2 - lon1) * Math.PI) / 180;

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c;
        }

        function calculateSpeed(position) {
            const currentTime = new Date().getTime();
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;

            if (previousPosition && previousTime) {
                const distance = haversine(
                    previousPosition.coords.latitude,
                    previousPosition.coords.longitude,
                    currentLat,
                    currentLon
                );

                const timeDiff = (currentTime - previousTime) / 1000;
                const speed = distance / timeDiff;
                const speedKmh = speed * 0.36;
                setSpeed(speedKmh.toFixed(2));
                console.log('Speed:', speedKmh);
            }

            previousPosition = position;
            previousTime = currentTime;
        }

        function handleError(error) {
            console.error(`Error: ${error.message}`);
            setSpeed(0);
        }

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(calculateSpeed, handleError, {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 3000,
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }

    }, [speed]); 

    return (
        <SpeedContext.Provider value={speed}>
            {children}
        </SpeedContext.Provider>
    );
};
