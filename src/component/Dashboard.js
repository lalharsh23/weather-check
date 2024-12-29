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

      const { time, temperature_2m_max, temperature_2m_min, temperature_2m_mean, apparent_temperature_max, apparent_temperature_min, apparent_temperature_mean } = response.data.daily;

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
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Weather Dashboard</h1>
        <p className="text-xl text-gray-600 mt-2">Get the weather data for any location and date range.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Grid Layout - Adjust for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Latitude Input */}
          <div className="sm:col-span-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">Latitude</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter latitude"
              min={-90}
              max={90}
            />
          </div>

          {/* Longitude Input */}
          <div className="sm:col-span-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">Longitude</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter longitude"
              min={-180}
              max={180}
            />
          </div>

          {/* Start Date */}
          <div className="sm:col-span-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="sm:col-span-1">
            <label className="block text-lg font-medium text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 text-center mt-4">
            <button
              onClick={fetchWeatherData}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Weather Data
            </button>
          </div>
        </div>

        {/* Error and Loading States */}
        {loading && <div className="text-center text-gray-600">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* Weather Data Chart */}
        {weatherData && !loading && (
          <div className="mt-8">
            <Line data={chartData} />
          </div>
        )}

        {/* Weather Data Table */}
        {weatherData && !loading && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Max Temp (°C)</th>
                  <th className="py-3 px-4 text-left">Min Temp (°C)</th>
                  <th className="py-3 px-4 text-left">Mean Temp (°C)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((day, index) => (
                  <tr key={index} className="border-t hover:bg-gray-100">
                    <td className="py-3 px-4">{day.date}</td>
                    <td className="py-3 px-4">{day.temperature_2m_max}</td>
                    <td className="py-3 px-4">{day.temperature_2m_min}</td>
                    <td className="py-3 px-4">{day.temperature_2m_mean}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <select
                onChange={handleRowsPerPageChange}
                value={rowsPerPage}
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <div className="flex items-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
