import React from 'react'
import './SidePanel.css'
import LifelineDisplay from './LifelineDisplay';

    export default function SidePanel({ prizeAmountsInfo, lifelinesInfo, userRetire, disabled }) {

    // To insert commas in numbers
    const prettifyNumber = num => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className={"SidePanelContainer"+(disabled ? " Disabled" : "")}>
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
                    <button className="LeaveEarlyButton" onClick={() => userRetire()} disabled={disabled}>Quit</button>
                </div>
            </div>
            <div className="LifelinesContainer">
            <LifelineDisplay
                lifelineFunctions = {lifelinesInfo.lifelineFunctions}
                lifelinesRemaining = {lifelinesInfo.lifelinesRemaining}
                disabled = {disabled}
                />
                </div>
        </div>
    )
}
