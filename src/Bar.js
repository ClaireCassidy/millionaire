import React from 'react'

export default function Bar({ height, index }) {

    const letters = ["A", "B", "C", "D"];

    const barContainerStyle = {
        display: "flex",
        flexDirection: "column",
        // border: "1px solid green",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%",
        width: "20%"
    }

    const barStyle = {
        height: height + "%",
        width: "80%",
        backgroundColor: "red",
        border: "1px solid black",
        // margin: "0px 10px 10px 0px",
        alignSelf: "center"
    }

    return (
        <>
            <div className="BarContainer" style={barContainerStyle}>
            <p style={{color: "white"}}>{letters[index]}</p>

                <div className="Bar" style={barStyle}>
                </div>
            </div>
        </>
    )
}
