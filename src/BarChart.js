import React from 'react'
import Bar from './Bar'

export default function BarChart({yValues}) {

    const barChartStyle = {
        height: "200px",
        width: "200px",
        backgroundColor: "blue",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
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
