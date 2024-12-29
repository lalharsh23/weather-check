import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWeatherData = async () => {
    if (!latitude || !longitude || !startDate || !endDate) {
      setError("Please fill out all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude,
          longitude,
          start_date: startDate.toISOString().split("T")[0], // format date to YYYY-MM-DD
          end_date: endDate.toISOString().split("T")[0],   // format date to YYYY-MM-DD
          daily: "temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean",
          temperature_unit: "celsius",
        },
      });

      // The response.data.daily contains the data arrays we need
      const { time, temperature_2m_max, temperature_2m_min, temperature_2m_mean, apparent_temperature_max, apparent_temperature_min, apparent_temperature_mean } = response.data.daily;

      // Organizing data into an array of objects
      const formattedData = time.map((date, index) => ({
        date,
        temperature_2m_max: temperature_2m_max[index],
        temperature_2m_min: temperature_2m_min[index],
        temperature_2m_mean: temperature_2m_mean[index],
        apparent_temperature_max: apparent_temperature_max[index],
        apparent_temperature_min: apparent_temperature_min[index],
        apparent_temperature_mean: apparent_temperature_mean[index],
      }));

      setWeatherData(formattedData);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: weatherData ? weatherData.map((day) => day.date) : [],
    datasets: [
      {
        label: "Max Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_max) : [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Min Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_min) : [],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Mean Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_mean) : [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const paginatedData = weatherData
    ? weatherData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const totalPages = weatherData ? Math.ceil(weatherData.length / rowsPerPage) : 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Weather Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-lg font-medium mb-2">Latitude</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter latitude"
            min={-90}
            max={90}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Longitude</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter longitude"
            min={-180}
            max={180}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-lg font-medium mb-2">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-lg font-medium mb-2">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="col-span-2 mt-4 text-center">
          <button
            onClick={fetchWeatherData}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Get Weather Data
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {weatherData && !loading && (
        <div className="mb-6">
          <Line data={chartData} />
        </div>
      )}

      {weatherData && !loading && (
        <div>
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Max Temp (°C)</th>
                <th className="border p-2">Min Temp (°C)</th>
                <th className="border p-2">Mean Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((day, index) => (
                <tr key={index}>
                  <td className="border p-2">{day.date}</td>
                  <td className="border p-2">{day.temperature_2m_max}</td>
                  <td className="border p-2">{day.temperature_2m_min}</td>
                  <td className="border p-2">{day.temperature_2m_mean}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <select
              onChange={handleRowsPerPageChange}
              value={rowsPerPage}
              className="p-2 border rounded-lg"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <div className="inline-block ml-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
