import React from 'react'

// Side panel sh

export default function SidePanel({increments, safeIndices, curQuestionIndex, numQs}) {

    // To insert commas in numbers
    const prettifyNumber = num => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            <ul>
            {increments.slice(0).reverse().map((elem, index) => {
                const highlight = (safeIndices.indexOf(index) > -1);
                return (highlight 
                    ? (<li key={index}>
                            <b>{prettifyNumber(elem)+((numQs - 1 - index) === curQuestionIndex ? " < Question Value" : "")}</b>
                        </li>) 
                    : (<li key={index}>
                            {prettifyNumber(elem)+((numQs - 1 - index) === curQuestionIndex ? " < Question Value" : "")}
                        </li>)) 
            })}
            </ul>
        </div>
    )
}
