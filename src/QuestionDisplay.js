import React, { useState, useEffect } from 'react'
import AnswerButton from './AnswerButton'

export default function QuestionDisplay({question, correctAnswer, incorrectAnswers, gotoNextQuestion}) {

    const [answers, setAnswers] = useState([correctAnswer, ...incorrectAnswers]);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
    const [lastAnswerText, setLastAnswerText] = useState(null);

    const selectAnswer = (answerCorrectness) => {
        setLastAnswerCorrect(answerCorrectness);
        setLastAnswerText(correctAnswer);
        gotoNextQuestion();
    }

    return (
        <>
            {/* <div className="question-display">This is the question display</div>
            <div className="answers-display">This is the answer display</div> */}
            <div><p>{question}</p></div>
            {
                // shuffle answers before rendering to ensure randomised position of correct answer
                [correctAnswer, ...incorrectAnswers]
                    .sort(() => Math.random() - 0.5)
                    .map(elem => {
                        return (
                            <AnswerButton
                                key={Date.now()+elem}
                                answer={elem}
                                isCorrect={(elem === correctAnswer)}
                                selectAnswer={selectAnswer}
                            />
                        );
                    })
            }

            {lastAnswerCorrect != null ? (lastAnswerCorrect === true ? <p><b>Correct!</b> The answer was "<i>{lastAnswerText}</i>".</p> : <p><b>Incorrect!</b> The correct answer was "<i>{lastAnswerText}</i>".</p>) : <></>}
        </>
    );

}
