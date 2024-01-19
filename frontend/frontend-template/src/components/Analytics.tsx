import Chart from "chart.js/auto";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, {useEffect, useRef, useState} from "react";
import '../css/Analytics.css'
import backHH from '../assets/backHomee.jpg';
import {fetchPieChartData} from "../features/analytics/AnalyticsAPIs";
import HashLoader from "react-spinners/HashLoader";
import {RouterProvider} from "react-router-dom";


export default function Analytics(){
  const[loading,setLoading]=useState(false);
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
      type: "pie",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: data.colors,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#090808', // Set legend label text color
              fontSize: 34,
            },
          },
          title: {
            display: true,
            text: data.title,
            color: '#090808', // Set chart title text color
            fontSize: 25,
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
          "#d90e0e",
          "rgb(60,222,35)",
          "rgb(128,58,234)",
          "rgb(89,2,22)",
          "rgb(54, 162, 235)",
        ],
      };

      const data2 = {
        title: "Mid Shift",
        labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
        values: arr2,
        colors: [
          "#d90e0e",
          "rgb(60,222,35)",
          "rgb(128,58,234)",
          "rgb(89,2,22)",
          "rgb(54, 162, 235)",
        ],
      };

      const data3 = {
        title: "Night Shift",
        labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
        values: arr3,
        colors: [
          "#f81818",
          "rgb(60,222,35)",
          "rgb(128,58,234)",
          "rgb(89,2,22)",
          "rgb(54, 162, 235)",
        ],
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
