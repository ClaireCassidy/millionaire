import React, { useState, useEffect, useRef } from 'react'
import './PortraitWindow.css'
import audienceBackground from './images/audience_background.png'
import player from './images/player.png'
import correctIcon from './images/correct_icon.png'
import BarChart from './BarChart.js'

export default function PortraitWindow({ imagePath, lastCorrectAnswer, answeredCorrectly, papSuggestedAnswer, papComment, askTheAudienceInfo, fiftyFiftyActive }) {

    const positiveFeedback = ["Good job!", "Congratulations!", "Nice one!", "That's right!", "Excellent!"];
    const negativeFeedback = ["Hard luck!", "Uh-oh...", "Oops...", "Unlucky!"];

    let playAnimation = useRef();
    const [feedbackComment, setFeedbackComment] = useState(null);


    useEffect(() => {
        //setPlayAnimation(answeredCorrectly);
        playAnimation = answeredCorrectly;
        if (lastCorrectAnswer !== null) {
            setFeedbackComment(generateComment());
        }

    }, [lastCorrectAnswer]);

    const styles = {
        backgroundImage: `url(${audienceBackground})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%"
        // backgroundSize: "100% 100%",
        // backgroundRepeat: "no-repeat"
    }

    //let image = "image1.jpg"

    //setPlayAnimation(answeredCorrectly);
    playAnimation = answeredCorrectly;


    // (!papSuggestedAnswer && lastCorrectAnswer && <p className="PortraitWindowText">{generateComment(lastCorrectAnswer !== null)} The answer was <span className="PrevCorrectAnswer">{lastCorrectAnswer}</span></p>)
    // (papSuggestedAnswer && <p className="PortraitWindowText">"I'd say the answer is <span className="PapSuggestedAnswer">{papSuggestedAnswer}</span>"</p>)}

    return (
        <div className="PortraitWindowContainer" style={styles}>
            {console.log(askTheAudienceInfo.heights)}
            {/* {askTheAudienceInfo.active ? <BarChart className="BarChart" yValues={askTheAudienceInfo.heights} />
                 : <>
                    {(!papSuggestedAnswer && lastCorrectAnswer && <p className="PortraitWindowText">{generateComment(lastCorrectAnswer !== null)} The answer was <span className="PrevCorrectAnswer">{lastCorrectAnswer}</span></p>)}
                    {(papSuggestedAnswer && <p className="PortraitWindowText">"I'd say the answer is <span className="PapSuggestedAnswer">{papSuggestedAnswer}</span>"</p>)}
                   </>
            } */}
            {askTheAudienceInfo.active && <BarChart className="BarChart" yValues={askTheAudienceInfo.heights} />}
            <div className="PortraitWindowContent">
            <img src={player} />
            {(!papSuggestedAnswer && lastCorrectAnswer && <p className="PortraitWindowText">{feedbackComment} The answer was <span className="PrevCorrectAnswer">{lastCorrectAnswer}</span></p>)}
            {(papSuggestedAnswer && <p className="PortraitWindowText"><i>"{papComment}<span className="PapSuggestedAnswer">{papSuggestedAnswer}</span>."</i></p>)}

            {/* {playAnimation && !papSuggestedAnswer && !askTheAudienceInfo.active && !fiftyFiftyActive && <p className="CorrectAnswerIcon" key={Math.random()}>YUH</p>} */}
            {playAnimation && !papSuggestedAnswer && !askTheAudienceInfo.active && !fiftyFiftyActive && <img src={correctIcon} className="CorrectAnswerIcon" key={Math.random()} alt="correct"/>}
            </div>
        </div>
    )

    function generateComment() {

        // pull a random positive/negative comment
        if (answeredCorrectly) {
            return positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
        } else {
            return negativeFeedback[Math.floor(Math.random() * negativeFeedback.length)];
        }

    }
}

{/* {imagePath && <img className="PortraitWindowImage" src={require("./images/image1.jpg")} alt="User Portrait"/>} */ }
{/* <p className="PortraitWindowText">{lastCorrectAnswer ? lastCorrectAnswer : "(Nothing)"}</p> */ }
{/* lastCorrectAnswer will be *null* if 1. user is answering first question, 2. the last question was answered incorrectly */ }
