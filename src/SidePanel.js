import React from 'react'
import phoneAFriendIcon from './images/phoneafriendicon.png'
import LifelineDisplay from './LifelineDisplay';

// Side panel sh

//export default function SidePanel({ increments, safeIndices, curQuestionIndex, numQs }) {
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
            {/* <LifelineDisplay />  */}
            {/* <div className="Lifelines">
                <img src={phoneAFriendIcon} />
                <img src={phoneAFriendIcon} />
                <img src={phoneAFriendIcon} />
            </div> */}
            <LifelineDisplay
                lifelineFunctions = {lifelinesInfo.lifelineFunctions}
                lifelinesRemaining = {lifelinesInfo.lifelinesRemaining}
                />
        </div>
    )
}
