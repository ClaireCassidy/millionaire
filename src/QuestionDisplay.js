import React, { useState, useEffect, useRef } from 'react'
import AnswerButton from './AnswerButton'

// @TODO:
// Merge gotoNextQuestion and incorrectAnswerSelected into single function 'handleSelection'
export default function QuestionDisplay({ question, correctAnswer, incorrectAnswers, handleSelection}) {

    const [answers, setAnswers] = useState(null);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
    const [lastAnswerText, setLastAnswerText] = useState(null);

    let randomOrder = useRef();

    const selectAnswer = (answerCorrectness) => {
        setLastAnswerCorrect(answerCorrectness);
        setLastAnswerText(correctAnswer);
        handleSelection(answerCorrectness);
    }

    useEffect(() => {
        randomOrder = computeRandomOrder([correctAnswer, ...incorrectAnswers].length);
        // console.log("ORDER: " +randomOrder);
        // console.log(JSON.stringify([correctAnswer, ...incorrectAnswers]));
        const reordered = reorderAnswers(randomOrder);
        // console.log(JSON.stringify(reordered));
        setAnswers(reordered);
    }, [incorrectAnswers]);

    const computeRandomOrder = (length) => {
        let orderArr = new Array(length);
        for (let i=0; i<orderArr.length; i++) {
            orderArr[i] = i;
        }

        orderArr.sort(() => Math.random() - 0.5);
        return orderArr;
    }

    const reorderAnswers = (indexingArray) => {

        let ans = [];

        for (let i=0; i<indexingArray.length; i++) {
            ans.push([correctAnswer, ...incorrectAnswers][indexingArray[i]]);
        }

        // console.log(ans);
        return ans;
    }


    return (
        <>
            {/* {console.log("Question Display rendering")} */}


            <div><p>{question}</p></div>

            {answers && answers.map(answer => {
                return (
                    <AnswerButton
                        key={Date.now() + answer}
                        answer={answer}
                        isCorrect={answer === correctAnswer}
                        selectAnswer={selectAnswer}
                        />
                );
            })}

            {lastAnswerCorrect != null ? (lastAnswerCorrect === true ? <p><b>Correct!</b> The answer was "<i>{lastAnswerText}</i>".</p> : <p><b>Incorrect!</b> The correct answer was "<i>{lastAnswerText}</i>".</p>) : <></>}
        </>
    );

}

                // shuffle answers before rendering to ensure randomised position of correct answer
                // [correctAnswer, ...incorrectAnswers]
                //     .sort(() => Math.random() - 0.5)
                //     .map(elem => {
                //         return (
                //             <AnswerButton
                //                 key={Date.now() + elem}
                //                 answer={elem}
                //                 isCorrect={(elem === correctAnswer)}
                //                 selectAnswer={selectAnswer}
                //             />
                //         );
                //     })
