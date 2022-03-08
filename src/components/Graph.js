import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "../App.css"

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const formatData = (Data, casesType) => {
  const graphData = [];
  let lastDataPoint;

  for (let date in Data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: Data[casesType][date] - lastDataPoint,
      };
      graphData.push(newDataPoint);
    }

    lastDataPoint = Data[casesType][date];
  }
  return graphData;
};

const Graph = ({ casesType = "cases" }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((d) => {
          const graphData = formatData(d, casesType);
          setData(graphData);
        });
    };
    fetchData();
  }, [casesType]);
  return (
    <div className="Graph" >
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [{ data: data }],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default Graph;
