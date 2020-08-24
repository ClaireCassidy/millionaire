import React from 'react'
import './SidePanel.css'
import LifelineDisplay from './LifelineDisplay';

    export default function SidePanel({ prizeAmountsInfo, lifelinesInfo, userRetire }) {

    // To insert commas in numbers
    const prettifyNumber = num => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // const getNearestSafeAmount = (curQuestionIndex, safeIndices, prizeIncrements) => {
    //     let amount = 0;

    //     // console.log("CurQuestionIndex: "+curQuestionIndex);
    //     // console.log(`CurQuestionIndex: ${curQuestionIndex}
    //     //     \nsafeIndices: ${safeIndices}
    //     //     \nprizeIncrements: ${prizeIncrements}`);

    //     // for (let i=0; i<curQuestionIndex; i++) {
    //     //     if (safeIndices.indexOf(i) >= 0) amount = prizeIncrements[i];
    //     // }

    //     return amount;
    // }

    return (
        <div className="SidePanelContainer">
            <div className="PrizeAmountsDiv">
                <h3 className="PrizeAmountsHeader">Question Value:</h3>
                <ul className="PrizeAmountsList">
                    {prizeAmountsInfo.increments.slice(0).reverse().map((elem, index) => {
                        const highlight = (prizeAmountsInfo.safeIndices.indexOf(prizeAmountsInfo.numQs - 1 - index) > -1);
                        const isCurrentAmount = (prizeAmountsInfo.numQs - 1 - index) === prizeAmountsInfo.curQuestionIndex;
                        return (highlight
                            ? (<li key={index} className={"SafeAmount"+(isCurrentAmount ? " CurrentValueSpecial" : "")+((prizeAmountsInfo.numQs - 1 - index) < prizeAmountsInfo.curQuestionIndex ? " AmountReached" : "")}>
                                {"€ "+prettifyNumber(elem)}
                            </li>)
                            : (<li key={index} className={"NormalAmount"+(isCurrentAmount ? " CurrentValue" : "")+((prizeAmountsInfo.numQs - 1 - index) < prizeAmountsInfo.curQuestionIndex ? " AmountReached" : "")}> 
                                {"€ "+prettifyNumber(elem)}
                            </li>))
                    })}
                </ul>
                <div className="QuitContainer">
                    <h4 className="LeaveEarlyText">Leave now with <span className="LeaveEarlyAmount">{"€ "+(prizeAmountsInfo.curQuestionIndex === 0 ? "0" : prizeAmountsInfo.increments[prizeAmountsInfo.curQuestionIndex - 1])}</span>?</h4>
                    <button className="LeaveEarlyButton" onClick={() => userRetire()}>Quit</button>
                </div>
            </div>
            <LifelineDisplay
                lifelineFunctions = {lifelinesInfo.lifelineFunctions}
                lifelinesRemaining = {lifelinesInfo.lifelinesRemaining}
                />
        </div>
    )
}
