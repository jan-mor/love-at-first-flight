import { useState, useEffect } from "react";

interface Coordinates {
    lat: number;
    lng: number;
}

const useLocation = () => {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported in this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: parseFloat(position.coords.latitude.toFixed(3)),
                    lng: parseFloat(position.coords.longitude.toFixed(3)),
                });
            },
            (err) => {
                setError(err.message);
            }
        );
    }, []);

    return { location, error };
};

export default useLocation;
