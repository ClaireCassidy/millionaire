import React from 'react'
import './LifelineDisplay.css'
import phoneAFriendIcon from './images/phoneafriendicon.png'
import askTheAudienceIcon from './images/ask_the_audience_icon.png'
import fiftyFiftyIcon from './images/fifty_fifty_icon.png'

export default function LifelineDisplay({ lifelineFunctions, lifelinesRemaining }) {

    // const buttonStyles = {
    //     phoneAFriend: {
    //         // background: `url(${phoneAFriendIcon}) no-repeat`,

    //     }
    // }

    return (
        <div className="LifelineDisplayContainer">
            <div className="LifelineDisplayHeaderContainer">
                <h3 className="LifelineDisplayHeader">Lifelines:</h3>
            </div>
            {/* <button onClick={() => lifelineFunctions.phoneAFriend()} disabled={!lifelinesRemaining.phoneAFriend}>Phone A Friend</button>
            <button onClick={() => lifelineFunctions.fiftyFifty()} disabled={!lifelinesRemaining.fiftyFifty}>50:50</button>
            <button onClick={() => lifelineFunctions.askTheAudience()} disabled={!lifelinesRemaining.askTheAudience}>Ask the Audience</button> */}

            {/* TODO: implement lifelines remaining functionality to disable buttons as above ^ */}
            {/* <button style={buttonStyles.phoneAFriend} onClick={() => lifelineFunctions.phoneAFriend}>
                <img src={phoneAFriendIcon}/>
                </button> */}
            {/* <img src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} style={buttonStyles.phoneAFriend}/>
            <img className="LifelineButton" src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} title="Phone a friend" disabled={!lifelinesRemaining.phoneAFriend}/>
            <img className="LifelineButton" src={askTheAudienceIcon} onClick={() => lifelineFunctions.askTheAudience()} title="Ask the audience" disabled={!lifelinesRemaining.askTheAudience}/> */}
            <div className="LifelineButtonsContainer">
                {console.log("From LifelineDisplay: "+JSON.stringify(lifelinesRemaining))}
                <input className="LifelineButton" type="image" src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} title={"Phone a friend"+(!lifelinesRemaining.phoneAFriend ? " (used)":"")} alt="Phone a friend lifeline" disabled={!lifelinesRemaining.phoneAFriend}/>
                <input className="LifelineButton" type="image" src={askTheAudienceIcon} onClick={() => lifelineFunctions.askTheAudience()} title={"Ask the audience"+(!lifelinesRemaining.askTheAudience ? " (used)" : "")} alt="Ask the audience lifeline"  disabled={!lifelinesRemaining.askTheAudience}/>
                <input className="LifelineButton" type="image" src={fiftyFiftyIcon} onClick={() => lifelineFunctions.fiftyFifty()} title={"Fifty fifty"+(!lifelinesRemaining.fiftyFifty ? " (used)":"")} alt="Fifty fifty lifeline"  disabled={!lifelinesRemaining.fiftyFifty}/>
            </div>
        </div>
    )
}
