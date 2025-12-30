'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
    temperature: number;
    weathercode: number;
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchWeather() {
            try {
<<<<<<< HEAD
                // Create abort controller with 5 second timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Greater Noida coordinates
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=28.4744&longitude=77.5040&current_weather=true',
                    { signal: controller.signal }
                );

                clearTimeout(timeoutId);

=======
                // Greater Noida coordinates
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=28.4744&longitude=77.5040&current_weather=true'
                );

>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();

                setWeather({
                    temperature: data.current_weather.temperature,
                    weathercode: data.current_weather.weathercode,
                });
<<<<<<< HEAD
            } catch (err: any) {
                // Silently handle abort errors (timeout)
                if (err.name === 'AbortError') {
                    console.debug('Weather API timeout - using fallback');
                } else {
                    console.debug('Weather fetch error:', err);
                }
=======
            } catch (err) {
>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="border border-[var(--ink-black)] p-4 text-center">
                <div className="text-sm text-[var(--ink-gray)]">Loading weather…</div>
            </div>
        );
    }

<<<<<<< HEAD
    // Error state - show fallback weather
    if (error || !weather) {
        return (
            <div className="border border-[var(--ink-black)] p-4 text-center">
                <div className="font-gothic text-2xl text-[var(--ink-gray)] mb-1">
                    Campus Weather
                </div>
                <div className="font-serif text-4xl font-bold mb-1">
                    24°C
                </div>
                <div className="font-sans-accent text-xs text-[var(--brand-purple)]">
                    SUNNY ☀️ • CODE COMPILING
                </div>
=======
    // Error state
    if (error || !weather) {
        return (
            <div className="border border-[var(--ink-black)] p-4 text-center">
                <div className="text-sm text-red-500">Weather unavailable</div>
>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
            </div>
        );
    }

    return (
        <div className="border border-[var(--ink-black)] p-4 text-center">
            <div className="font-gothic text-2xl text-[var(--ink-gray)] mb-1">
                Campus Weather
            </div>
            <div className="font-sans-accent text-xs text-[var(--ink-light)] mb-2 uppercase tracking-wider">
                Greater Noida, UP
            </div>

            <div className="font-serif text-4xl font-bold mb-1">
                {Math.round(weather.temperature)}°C
            </div>

            <div className="font-sans-accent text-xs text-[var(--brand-purple)]">
                {getWeatherLabel(weather.weathercode)}
            </div>
        </div>
    );
}

/* Helper function */
function getWeatherLabel(code: number) {
    if (code === 0) return 'SUNNY ☀️';
    if (code <= 3) return 'PARTLY CLOUDY ⛅';
    if (code <= 48) return 'CLOUDY ☁️';
    if (code <= 67) return 'RAINY 🌧️';
    if (code <= 99) return 'STORM 🌩️';
    return 'WEATHER';
}
