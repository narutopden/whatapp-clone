import React,{useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend : {
        display: false,
    },
    elements: {
        point: {
            redius: 0,
        }
    },
    maintainAspetRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callback: {
            lable: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: "ll",
                }
            }
        ],
        yAxes: [
            {
                graidLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format('0a')
                    }
                }
            }
        ]
    }
}

function LineGraph({casesType = "cases"}) {
    const [data, setData] = useState({});

    useEffect(() => {
      fetch(
        "https://cors-anywhere.herokuapp.com/" +
          "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      )
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data);
          setData(chartData);
        });
    }, [casesType]);

    const buildChartData = (data, casesType = "cases") => {
      const chartData = [];
      let lastDataPoint;
      for (let date in data.cases) {
        if (lastDataPoint) {
          const newDataPoint = {
            x: date,
            y: data[casesType][date] - lastDataPoint,
          };
          chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
      }
      return chartData;
    };
    return (
      <div>
          {data?.length>0 &&(

              <Line
                options = {options}
                data={{
                  datasets: [
                    {
                      backgroundColor: "rgba(204, 16, 52, 0.3)",
                      borderColor: "#cc1034",
                      data: data,
                    },
                  ],
                }}
              />
          )}
      </div>
    );
}

export default LineGraph;