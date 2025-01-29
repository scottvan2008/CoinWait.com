"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function InflationGraph() {
  const [chartData, setChartData] = useState({ datasets: [] })
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const years = [2009, 2013, 2017, 2021, 2025, 2029, 2033, 2037]
    setChartData({
      labels: years,
      datasets: [
        {
          label: "Bitcoin Supply (%)",
          data: [0, 50, 75, 85, 90, 95, 97, 98],
          borderColor: "rgb(59, 130, 246)",
          tension: 0.4,
        },
      ],
    })

    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Bitcoin Inflation vs. Time",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Supply Mined (%)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Year",
          },
        },
      },
    })
  }, [])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Line options={chartOptions} data={chartData} />
    </div>
  )
}

