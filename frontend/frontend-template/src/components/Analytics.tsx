import Chart from "chart.js/auto";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, {useEffect, useRef, useState} from "react";
import '../css/Analytics.css'
import backHH from '../assets/backHomee.jpg';
import {fetchPieChartData} from "../features/analytics/AnalyticsAPIs";

export default function Analytics(){
  const [selectedDate, setSelectedDate] = useState<Date | string>(new Date());
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);
  const chartInstance3 = useRef(null);

  const initializeChart = (chartRef, data) => {
    if (chartRef.current) {
      chartRef.current.getContext("2d").clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    }

    return new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Analytics',
            data: data.values,
            backgroundColor: data.colors,
            borderColor: data.borderColors,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: data.title,
            color: '#090808', // Set chart title text color
            font: {
              size: 25, // Set the font size for the title
            },
          },
          legend: {
            labels: {
              fontSize: 18, // Set the font size for the legend label ('Analytics')
              color: '#090808', // Set the font color for the legend label
            },
          },
        },
        scales: {
          x: {
            font: {
              size: 50,
            },
            ticks: {
              color: '#090808', // Set the font color for x-axis labels
            },
            grid: {
              color: '#090808', // Set the color of the x-axis grid lines
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              fontSize: 18, // Set the font size for the y-axis labels
              color: '#090808', // Set the font color for y-axis labels
            },
            grid: {
              color: '#090808', // Set the color of the y-axis grid lines
            },
          },
        },
      },
    });
  };


  useEffect(() => {
    const fetchDataAndInitializeCharts = async () => {
      const arr1 = await fetchPieChartData(selectedDate, "Morning");
      const arr2 = await fetchPieChartData(selectedDate, "Mid");
      const arr3 = await fetchPieChartData(selectedDate, "Night");
      const data1 = {
        title: "Morning Shift",
        labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
        values: arr1,
        colors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ],
        borderColors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ]
      };

      const data2 = {
        title: "Mid Shift",
        labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
        values: arr2,
        colors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ],
        borderColors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ]
      };

      const data3 = {
        title: "Night Shift",
        labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
        values: arr3,
        colors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ],
        borderColors: [
          "rgba(253,242,7,0.95)",
          "rgb(115,114,114)",
          "rgb(65,190,2)",
          "rgb(245,2,2)",
          "rgb(2,38,180)",
        ]
      };
      chartInstance1.current = initializeChart(chartRef1, data1);
      chartInstance2.current = initializeChart(chartRef2, data2);
      chartInstance3.current = initializeChart(chartRef3, data3);
    };
    fetchDataAndInitializeCharts().then(r => {console.log("Fetched Pie Chart Data")});

    return () => {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
      if (chartInstance2.current) {
        chartInstance2.current.destroy();
      }
      if (chartInstance3.current) {
        chartInstance3.current.destroy();
      }
    };
  }, [selectedDate]);

  const handleDatePickerChange = (date: Date | null) => {
    if (date) {
      const formattedDate = new Date(date);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate('');
    }
  };

  return (
        <div className="container-Home" style={{backgroundImage:`url(${backHH})`, backgroundPosition: 'center', backgroundSize:'cover'}}>
          <div className="DateAnalytics">
            <div>
              <text className="select-date">Date:  </text>
              <DatePicker
                  className='dateee'
                  selected={selectedDate}
                  onChange={handleDatePickerChange}
                  dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <div className="containerr" >
            <canvas ref={chartRef1} />
            <canvas ref={chartRef2} />
            <canvas ref={chartRef3} />
          </div>
        </div>
  );
}
