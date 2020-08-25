import React, { useState, useEffect } from 'react'
import AnswerButton from './AnswerButton'
import './QuestionDisplay.css'

export default function QuestionDisplay({ question, correctAnswer, difficulty, handleSelection, answerButtonsDisabled, answers, disabledAnswersIndices, fiftyFiftyActive }) {

    const selectAnswer = (answerCorrectness) => {
        handleSelection(answerCorrectness);
    }

    return (
        <div className="QuestionDisplayContainer">

            <div className="QuestionTextDiv">
                <p className="QuestionText">{question}</p>
            </div>

            <div className="AnswersGrid">
                {answers && answers.map((answer, index) => {
                    return (
                        <AnswerButton
                            key={Date.now() + answer}
                            answer={answer}
                            isCorrect={answer === correctAnswer}
                            selectAnswer={selectAnswer}
                            disabled={answerButtonsDisabled || (fiftyFiftyActive && disabledAnswersIndices.indexOf(index) > -1)}
                        />
                    );
                })}
            </div>
        </div>
    );

}