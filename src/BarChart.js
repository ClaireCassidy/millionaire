import React from 'react'
import Bar from './Bar'

export default function BarChart({yValues}) {

    const barChartStyle = {
        height: "20%",
        width: "20%",
        backgroundColor: "blue",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        border: "1px solid yellow",
        padding: "10px"
    }

    return (
        <div className="BarChart" style={barChartStyle}> 
            {yValues.map((height, index) => {
                return (
                    <Bar height={height*100} index={index} key={Date.now()+index} />
                );
            })}
        </div>
    )
}
