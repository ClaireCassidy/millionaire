import React from "react";
import "./GameOverScreen.css";

export default function GameOverScreen({
  gameOverType,
  amountWon,
  gameOverTypes,
  reload,
}) {
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
          <h2>Good Job!</h2>
          <h3>You've walked away with</h3>
          <h3>€ {amountWon}</h3>
          <button onClick={() => reload()}>Play Again</button>
        </div>
      )}
      {gameOverType === gameOverTypes.LOSE && (
        <div className="LoseScreen">
          <h2>Hard Luck!</h2>
          <h3>You've walked away with</h3>
          <h3>€ {amountWon}</h3>
          <button onClick={() => reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
}
