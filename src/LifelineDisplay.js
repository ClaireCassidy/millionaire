import React from 'react'
import './LifelineDisplay.css'
import phoneAFriendIcon from './images/phoneafriendicon.png'

export default function LifelineDisplay({lifelineFunctions, lifelinesRemaining}) {

    const buttonStyles = {
        phoneAFriend: {
            // background: `url(${phoneAFriendIcon}) no-repeat`,
            
        }
    }

    return (
        <div>
            <h3>Lifelines:</h3>
            {/* <button onClick={() => lifelineFunctions.phoneAFriend()} disabled={!lifelinesRemaining.phoneAFriend}>Phone A Friend</button>
            <button onClick={() => lifelineFunctions.fiftyFifty()} disabled={!lifelinesRemaining.fiftyFifty}>50:50</button>
            <button onClick={() => lifelineFunctions.askTheAudience()} disabled={!lifelinesRemaining.askTheAudience}>Ask the Audience</button> */}
            
            {/* TODO: implement lifelines remaining functionality to disable buttons as above ^ */}
            {/* <button style={buttonStyles.phoneAFriend} onClick={() => lifelineFunctions.phoneAFriend}>
                <img src={phoneAFriendIcon}/>
                </button> */}
            {/* <img src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} style={buttonStyles.phoneAFriend}/> */}
            <img src={phoneAFriendIcon} onClick={() => lifelineFunctions.phoneAFriend()} className="LifelineButton" title="Phone A Friend"/>
        </div>
    )
}
