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
  const [selectedData, setSelectedData] = useState({
    temperature_2m_max: true,
    temperature_2m_min: false,
    temperature_2m_mean: false,
    apparent_temperature_max: false,
    apparent_temperature_min: false,
    apparent_temperature_mean: false,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch weather data
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
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          daily:
            "temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean",
          temperature_unit: "celsius",
        },
      });

      const {
        time,
        temperature_2m_max,
        temperature_2m_min,
        temperature_2m_mean,
        apparent_temperature_max,
        apparent_temperature_min,
        apparent_temperature_mean,
      } = response.data.daily;

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

  const handleCheckboxChange = (e) => {
    setSelectedData({
      ...selectedData,
      [e.target.name]: e.target.checked,
    });
  };

  const chartData = {
    labels: weatherData ? weatherData.map((day) => day.date) : [],
    datasets: [
      selectedData.temperature_2m_max && {
        label: "Max Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_max) : [],
        borderColor: "rgb(75, 192, 19)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      selectedData.temperature_2m_min && {
        label: "Min Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_min) : [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      selectedData.temperature_2m_mean && {
        label: "Mean Temperature (°C)",
        data: weatherData ? weatherData.map((day) => day.temperature_2m_mean) : [],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      selectedData.apparent_temperature_max && {
        label: "Max Apparent Temp (°C)",
        data: weatherData ? weatherData.map((day) => day.apparent_temperature_max) : [],
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
      selectedData.apparent_temperature_min && {
        label: "Min Apparent Temp (°C)",
        data: weatherData ? weatherData.map((day) => day.apparent_temperature_min) : [],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
      selectedData.apparent_temperature_mean && {
        label: "Mean Apparent Temp (°C)",
        data: weatherData ? weatherData.map((day) => day.apparent_temperature_mean) : [],
        borderColor: "rgb(255, 159, 223)",
        backgroundColor: "rgba(255, 159, 223, 0.2)",
      },
    ].filter(Boolean), // Remove undefined entries
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = weatherData ? weatherData.slice(indexOfFirstRow, indexOfLastRow) : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  return (
    <>
      <div className="container mx-auto px-0 py-0 bg-gray-200 min-h-screen">
        <div>
          <img 
            src="https://i0.wp.com/traveltoyournature.com/wp-content/uploads/2023/07/beautiful-nature-scenery-Sikkim-India-1024x576.jpg?resize=1024%2C576"
            alt="Beautiful nature scenery"
            className="w-full h-80 "
          />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl mt-4 font-bold text-gray-900 tracking-tight">Weather Dashboard</h1>
          <p className="text-l text-gray-600 mt-2">Get the weather data for any location and date range.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-0 rounded-lg shadow-lg">
          {/* Location and Date Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 p-8 gap-8 mb-6">
            <div className="sm:col-span-1 mb-4 sm:mb-0">
              <label className="block text-lg font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter latitude"
                min={-90}
                max={90}
              />
            </div>

            <div className="sm:col-span-1 mb-4 sm:mb-0">
              <label className="block text-lg font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter longitude"
                min={-180}
                max={180}
              />
            </div>

            <div className="sm:col-span-1 mb-4 sm:mb-0">
              <label className="block text-lg font-medium text-gray-700 mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-32 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-1 mb-4 sm:mb-0">
              <label className="block text-lg font-medium text-gray-700 mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="w-32 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkbox Selection */}
            <div className="sm:col-span-1 mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-6 mr-36 whitespace-nowrap">Select Weather Data</h2>
              <div className="space-y-3 ">
                {Object.keys(selectedData).map((dataKey) => (
                  <div key={dataKey} className="flex items-center  space-x-2">
                    <input
                      type="checkbox"
                      name={dataKey}
                      checked={selectedData[dataKey]}
                      onChange={handleCheckboxChange}
                      className="mr-2 ml-0"
                    />
                    <label className="text-lg text-gray-700 whitespace-nowrap">
                      {dataKey.replace(/_/g, " ").toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
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
              <div className="relative h-80">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // Prevents fixed aspect ratio
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Date",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Temperature (°C)",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Weather Data Table */}
          {weatherData && !loading && (
            <div className="mt-8 overflow-x-auto"> {/* Allow horizontal scrolling */}
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Max Temp (°C)</th>
                    <th className="px-4 py-2 border">Min Temp (°C)</th>
                    <th className="px-4 py-2 border">Mean Temp (°C)</th>
                    <th className="px-4 py-2 border">Max Apparent Temp (°C)</th>
                    <th className="px-4 py-2 border">Min Apparent Temp (°C)</th>
                    <th className="px-4 py-2 border">Mean Apparent Temp (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{data.date}</td>
                      <td className="px-4 py-2 border">{data.temperature_2m_max}</td>
                      <td className="px-4 py-2 border">{data.temperature_2m_min}</td>
                      <td className="px-4 py-2 border">{data.temperature_2m_mean}</td>
                      <td className="px-4 py-2 border">{data.apparent_temperature_max}</td>
                      <td className="px-4 py-2 border">{data.apparent_temperature_min}</td>
                      <td className="px-4 py-2 border">{data.apparent_temperature_mean}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <div>
                  <label className="text-lg font-medium">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="ml-2 p-2  border border-gray-300 rounded-lg"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="whitespace-nowrap">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === Math.ceil(weatherData.length / rowsPerPage)}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
