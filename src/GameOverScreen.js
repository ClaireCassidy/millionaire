import React from "react";
import "./GameOverScreen.css";

export default function GameOverScreen({
  gameOverType,
  amountWon,
  gameOverTypes,
  reload,
  correctAnswer
}) {
  // To insert commas in numbers
  const prettifyNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="GameOverScreenContainer">
      {gameOverType === gameOverTypes.WIN && (
        <div className="WinScreen">
          <div className="WinScreenContent">
            <h2 className="Congratulations">Congratulations!</h2>
            <h3 className="CongratulationsSubtitle">You are a millionaire!</h3>
            <h2 className="OneMillion">€1,000,000</h2>
            <button className="ReloadButton" onClick={() => reload()}>
              Play Again
            </button>
          </div>
        </div>
      )}
      {gameOverType === gameOverTypes.RETIRE && (
        <div className="RetireScreen">
          <div className="RetireScreenContent">
            <h2 className="RetireHeader">Good Job!</h2>
            <p className="CorrectAnswerText">The answer was <span className="CorrectAnswer">{correctAnswer}</span></p>
            <h3 className="RetireSubtitle">You've walked away with</h3>
            <h3 className="RetireAmount">€ {prettifyNumber(amountWon)}</h3>
            <button className="ReloadButton" onClick={() => reload()}>
              Play Again
            </button>
          </div>
        </div>
      )}
      {gameOverType === gameOverTypes.LOSE && (
        <div className="LoseScreen">
          <div className="LoseScreenContent">
            <h2 className="LoseScreenHeader">Hard Luck!</h2>
            <p className="CorrectAnswerText">The answer was <span className="CorrectAnswer">{correctAnswer}</span></p>
            <h3 className="LoseScreenSubtitle">You've left with the nearest <span className="Gold">Safety Net amount</span> of</h3>
            <h3 className="SafetyNetAmount">€ {prettifyNumber(amountWon)}</h3>
            <button className="ReloadButton" onClick={() => reload()}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
