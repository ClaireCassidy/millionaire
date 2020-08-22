import React from 'react'
import LifelineDisplay from './LifelineDisplay';

    export default function SidePanel({ prizeAmountsInfo, lifelinesInfo }) {

    // To insert commas in numbers
    const prettifyNumber = num => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className="SidePanelContainer">
            <div className="PrizeAmountsDiv">
                <ul>
                    {prizeAmountsInfo.increments.slice(0).reverse().map((elem, index) => {
                        const highlight = (prizeAmountsInfo.safeIndices.indexOf(index) > -1);
                        return (highlight
                            ? (<li key={index}>
                                <b>{prettifyNumber(elem) + ((prizeAmountsInfo.numQs - 1 - index) === prizeAmountsInfo.curQuestionIndex ? " < Question Value" : "")}</b>
                            </li>)
                            : (<li key={index}>
                                {prettifyNumber(elem) + ((prizeAmountsInfo.numQs - 1 - index) === prizeAmountsInfo.curQuestionIndex ? " < Question Value" : "")}
                            </li>))
                    })}
                </ul>
            </div>
            <LifelineDisplay
                lifelineFunctions = {lifelinesInfo.lifelineFunctions}
                lifelinesRemaining = {lifelinesInfo.lifelinesRemaining}
                />
        </div>
    )
}
