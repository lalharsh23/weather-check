Weather Dashboard
A responsive and interactive dashboard that allows users to view historical weather data for a specific location and date range using the Open-Meteo Historical Weather API. The dashboard provides weather details including maximum, minimum, and mean temperatures over the selected date range and location, displayed both in graphical and tabular formats.

Features
Location Input: Users can enter latitude and longitude coordinates to get weather data.
Date Range Selection: Users can pick a start date and end date using a date picker.
Graphical Visualization: The data is visualized using a line graph (Chart.js).
Data Table: The fetched weather data is displayed in a paginated table with configurable rows per page.
Responsive Design: The app is fully responsive and optimized for mobile, tablet, and desktop views.
Loading & Error Handling: Displays loading states while fetching data and handles errors like invalid inputs or failed API requests.

Tech Stack
React: JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for styling the application.
Chart.js: A library for creating beautiful charts.
Axios: A promise-based HTTP client for making API requests.
React DatePicker: For selecting start and end dates.
Open-Meteo API: Free weather data API to fetch historical weather data.


Installation
Prerequisites
Make sure you have the following installed on your machine:

Node.js (v16 or higher)
npm (Node Package Manager)
Steps to run the project locally:
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
Install the dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
This will start the React development server and open the application in your default browser at http://localhost:3000.

How to Use
Enter Latitude and Longitude: Input valid coordinates (latitude and longitude) of the location you want to check the weather for.

Select Date Range: Use the date picker to choose the start and end dates for the weather data.

Fetch Data: Click the "Get Weather Data" button to fetch the weather data for the selected location and date range.

View Data:

Chart: View a line graph that shows maximum, minimum, and mean temperatures for the selected date range.
Table: View the same data in a paginated table below the chart.
