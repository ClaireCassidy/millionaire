import React from 'react'

export default function LifelineDisplay({lifelineFunctions, lifelinesRemaining}) {
    return (
        <div>
            <hr />
            <h3>Lifelines:</h3>
            <button onClick={() => lifelineFunctions.phoneAFriend()} disabled={!lifelinesRemaining.phoneAFriend}>Phone A Friend</button>
            <button onClick={() => lifelineFunctions.fiftyFifty()} disabled={!lifelinesRemaining.fiftyFifty}>50:50</button>
            <button onClick={() => lifelineFunctions.askTheAudience()} disabled={!lifelinesRemaining.askTheAudience}>Ask the Audience</button>
            <hr />
        </div>
    )
}
