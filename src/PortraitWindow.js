import React, { useState, useEffect } from 'react'
import './PortraitWindow.css'
import image from './images/image1.jpg'

export default function PortraitWindow({imagePath, lastCorrectAnswer, answeredCorrectly}) {

    const positiveFeedback = ["Good job!", "Congratulations!", "Nice one!", "That's right!", "Excellent!"];
    const negativeFeedback = ["Hard luck!", "Uh-oh...", "Oops...", "Unlucky!"];

    let [playAnimation, setPlayAnimation] = useState(false);

    useEffect( () => {
        setPlayAnimation(answeredCorrectly);

    }, [lastCorrectAnswer]);

    const styles = {
        backgroundImage: `url(${image})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat"
    }

    //let image = "image1.jpg"

    //setPlayAnimation(answeredCorrectly);
    playAnimation = answeredCorrectly;

    return (
        <div className="PortraitWindowContainer" style={styles}>
            {/* {imagePath && <img className="PortraitWindowImage" src={require("./images/image1.jpg")} alt="User Portrait"/>} */}
            {/* <p className="PortraitWindowText">{lastCorrectAnswer ? lastCorrectAnswer : "(Nothing)"}</p> */}
            {/* lastCorrectAnswer will be *null* if 1. user is answering first question, 2. the last question was answered incorrectly */}
            {lastCorrectAnswer && <p className="PortraitWindowText">{generateComment(lastCorrectAnswer !== null)} The answer was <span className="PrevCorrectAnswer">{lastCorrectAnswer}</span></p>}
            {playAnimation && <p className="CorrectAnswerIcon" key={Math.random()}>YUH</p>}
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
