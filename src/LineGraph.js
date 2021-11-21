import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
import { getBackgroundColor, getColor } from './utils';


const options = {
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type: "time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ], 
    },
}

function LineGraph ({casesType = 'recovered', ...props}) {

    const [data, setData] = useState({});
    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() =>{
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data1 =>{
            const chartData = buildChartData(data1, casesType);
            setData(chartData);
        })
        }
        fetchData();
    },[casesType])

    const buildChartData = (data2, casesType) => {
        const chartData = [];
        let lastDataPoint;
        Object.keys(data2[casesType]).forEach((date) =>{
            if(lastDataPoint && data2[casesType][date] !== 0){
                const newDataPoint = {
                    x:date,
                    y: data2[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data2[casesType][date];
        })
        return chartData;
    }

    return (
        
        <div className = {props.className}>
            {data?.length > 0 &&(
                <Line 
                options={options}
                data = {{
                    datasets:[
                        {   
                            backgroundColor:`${getBackgroundColor(casesType)}`,
                            fill: true,
                            borderColor:`${getColor(casesType)}`,
                            data:data
                        }
                    ]
                }}
            />
            )}
            

        </div>
    )
}

export default LineGraph
