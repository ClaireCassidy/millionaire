import React, { useState, useEffect, useRef } from "react";
import "./PortraitWindow.css";
import audienceBackground from "./images/audience_background.png";
import player from "./images/player.png";
import correctIcon from "./images/correct_icon.png";
import BarChart from "./BarChart.js";

export default function PortraitWindow({
  imagePath,
  lastCorrectAnswer,
  answeredCorrectly,
  papSuggestedAnswer,
  papComment,
  askTheAudienceInfo,
  fiftyFiftyActive,
}) {
  const positiveFeedback = [
    "Good job!",
    "Congratulations!",
    "Nice one!",
    "That's right!",
    "Excellent!",
  ];
  const negativeFeedback = ["Hard luck!", "Uh-oh...", "Oops...", "Unlucky!"];

  let playAnimation = useRef();
  const [feedbackComment, setFeedbackComment] = useState(null);

  useEffect(() => {
    playAnimation = answeredCorrectly;
    if (lastCorrectAnswer !== null) {
      setFeedbackComment(generateComment());
    }
  }, [lastCorrectAnswer]);

  const styles = {
    backgroundImage: `url(${audienceBackground})`,
    backgroundRepeat: "repeat-x",
    backgroundSize: "auto 100%",
  };

  playAnimation = answeredCorrectly;

  return (
    <div className="PortraitWindowContainer" style={styles}>

      {askTheAudienceInfo.active && (
        <BarChart className="BarChart" yValues={askTheAudienceInfo.heights} />
      )}
      <div className="PortraitWindowContent">
        <img src={player} />
        {!papSuggestedAnswer && lastCorrectAnswer && (
          <p className="PortraitWindowText">
            {feedbackComment} The answer was{" "}
            <span className="PrevCorrectAnswer">{lastCorrectAnswer}</span>
          </p>
        )}
        {papSuggestedAnswer && (
          <p className="PortraitWindowText">
            <i>
              "{papComment}
              <span className="PapSuggestedAnswer">{papSuggestedAnswer}</span>."
            </i>
          </p>
        )}

        {playAnimation &&
          !papSuggestedAnswer &&
          !askTheAudienceInfo.active &&
          !fiftyFiftyActive && (
            <img
              src={correctIcon}
              className="CorrectAnswerIcon"
              key={Math.random()}
              alt="correct"
            />
          )}
      </div>
    </div>
  );

  function generateComment() {
    // pull a random positive/negative comment
    if (answeredCorrectly) {
      return positiveFeedback[
        Math.floor(Math.random() * positiveFeedback.length)
      ];
    } else {
      return negativeFeedback[
        Math.floor(Math.random() * negativeFeedback.length)
      ];
    }
  }
}
