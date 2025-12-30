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
                // Greater Noida coordinates
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=28.4744&longitude=77.5040&current_weather=true'
                );

                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();

                setWeather({
                    temperature: data.current_weather.temperature,
                    weathercode: data.current_weather.weathercode,
                });
            } catch (err) {
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
            <div className="border border-gray-300 p-4 text-center rounded-lg bg-gray-50 flex flex-col justify-center items-center h-full min-h-[140px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-purple)] mb-2"></div>
                <div className="text-sm text-gray-500 font-sans animate-pulse">Checking skies...</div>
            </div>
        );
    }

    // Error state
    if (error || !weather) {
        return (
            <div className="border border-red-200 bg-red-50 p-4 text-center rounded-lg h-full min-h-[140px] flex flex-col justify-center">
                <div className="text-xl mb-1">📡</div>
                <div className="text-sm text-red-500 font-sans">Weather data unavailable</div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 p-4 text-center rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <div className="font-sans text-xs font-bold text-gray-500 tracking-widest uppercase mb-1">
                Campus Weather
            </div>

            <div className="text-xs text-[var(--brand-purple)] font-medium mb-3 flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                GREATER NOIDA, UP
            </div>

            <div className="font-serif text-5xl font-bold text-gray-800 mb-2 tracking-tighter">
                {Math.round(weather.temperature)}°<span className="text-2xl align-top text-gray-400">C</span>
            </div>

            <div className="font-sans text-xs font-bold text-[var(--brand-purple)] bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {getWeatherLabel(weather.weathercode)}
            </div>
        </div>
    );
}

/* Helper function */
function getWeatherLabel(code: number) {
    if (code === 0) return 'Sunny ☀️';
    if (code <= 3) return 'Partly Cloudy ⛅';
    if (code <= 48) return 'Cloudy ☁️';
    if (code <= 67) return 'Rainy 🌧️';
    if (code <= 77) return 'Snow ❄️';
    if (code <= 82) return 'Heavy Rain ⛈️';
    if (code <= 99) return 'Thunderstorm 🌩️';
    return 'Clear';
}
