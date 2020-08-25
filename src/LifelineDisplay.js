import React from 'react'
import './LifelineDisplay.css'
import phoneAFriendIcon from './images/phoneafriendicon.png'
import askTheAudienceIcon from './images/ask_the_audience_icon.png'
import fiftyFiftyIcon from './images/fifty_fifty_icon.png'

export default function LifelineDisplay({ lifelineFunctions, lifelinesRemaining, disabled }) {

    return (
        <div className="LifelineDisplayContainer">
            
            <div className="LifelineDisplayHeaderContainer">
                <h3 className="LifelineDisplayHeader">Lifelines:</h3>
            </div>
            
            <div className="LifelineButtonsContainer">
                {console.log("From LifelineDisplay: "+JSON.stringify(lifelinesRemaining))}
                <input className="LifelineButton" type="image" src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} title={"Phone a friend"+(!lifelinesRemaining.phoneAFriend ? " (used)":"")} alt="Phone a friend lifeline" disabled={!lifelinesRemaining.phoneAFriend || disabled}/>
                <input className="LifelineButton" type="image" src={askTheAudienceIcon} onClick={() => lifelineFunctions.askTheAudience()} title={"Ask the audience"+(!lifelinesRemaining.askTheAudience ? " (used)" : "")} alt="Ask the audience lifeline"  disabled={!lifelinesRemaining.askTheAudience || disabled}/>
                <input className="LifelineButton" type="image" src={fiftyFiftyIcon} onClick={() => lifelineFunctions.fiftyFifty()} title={"Fifty fifty"+(!lifelinesRemaining.fiftyFifty ? " (used)":"")} alt="Fifty fifty lifeline"  disabled={!lifelinesRemaining.fiftyFifty || disabled}/>
            </div>
            
        </div>
    )
}
