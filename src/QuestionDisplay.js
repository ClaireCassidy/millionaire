import React, { useState, useEffect, useRef } from 'react'
import AnswerButton from './AnswerButton'
import LifelineDisplay from './LifelineDisplay'

// @TODO:
// Merge gotoNextQuestion and incorrectAnswerSelected into single function 'handleSelection'
export default function QuestionDisplay({ question, correctAnswer, incorrectAnswers, handleSelection, answerButtonsDisabled, lifelineSetters, lifelinesRemaining }) {

    const [answers, setAnswers] = useState(null);
    const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([true, true, true, true]);
    const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false);

    let randomOrder = useRef();

    const selectAnswer = (answerCorrectness) => {
        handleSelection(answerCorrectness);
        setFiftyFiftyActive(false);
        setDisabledAnswersIndices([]);
    }

    useEffect(() => {
        randomOrder = computeRandomOrder([correctAnswer, ...incorrectAnswers].length);
        // console.log("ORDER: " +randomOrder);
        // console.log(JSON.stringify([correctAnswer, ...incorrectAnswers]));
        const reordered = reorderAnswers(randomOrder);
        // console.log(JSON.stringify(reordered));
        setAnswers(reordered);
        setDisabledAnswersIndices(generateDisabledAnswersIndices(reordered));

    }, [incorrectAnswers]);

    const computeRandomOrder = (length) => {
        let orderArr = new Array(length);
        for (let i = 0; i < orderArr.length; i++) {
            orderArr[i] = i;
        }

        orderArr.sort(() => Math.random() - 0.5);
        return orderArr;
    }

    const lifelineFunctions = {
        fiftyFifty : () => {
            console.log("Fifty Fifty Activated");
            //console.log(disabledAnswersIndices)
            console.log("Disabling answers \""+answers[disabledAnswersIndices[0]]+", \""+answers[disabledAnswersIndices[1]]+"\"")
            setFiftyFiftyActive(true);
            lifelineSetters.disableFiftyFifty();
        },
    
        phoneAFriend : () => {
            console.log("Phone a Friend Activated");
            lifelineSetters.disablePhoneAFriend();
        },
    
        askTheAudience : () => {
            console.log("Ask the Audience Activated");
            lifelineSetters.disableAskTheAudience();
        }
    }

    const reorderAnswers = (indexingArray) => {

        let ans = [];

        for (let i = 0; i < indexingArray.length; i++) {
            ans.push([correctAnswer, ...incorrectAnswers][indexingArray[i]]);
        }

        // console.log(ans);
        return ans;
    }

    const generateDisabledAnswersIndices = (answers) => {
        // first get the index of the correct answer so as to avoid disabling it
        // let correctAnswerIndex = -1;
        // let arr = [false, false, false, false];
        // let ans = answers.slice();

        // for (let i=0; i<answers.length; i++) {
        //     if (answers[i] === correctAnswer) correctAnswerIndex = i; break;
        // }
    
        // Just disable the first two answers in the incorrectAnswers prop (they'll be in a random spot in answers)
        let indices = [];
        let incorrectRandomised = incorrectAnswers.slice().sort(() => 0.5 - Math.random());
        indices.push(answers.indexOf(incorrectRandomised[0]));
        indices.push(answers.indexOf(incorrectRandomised[1]));
        console.log("correct answer: "+correctAnswer+", disabling indices "+indices+" ("+answers[indices[0]]+", "+answers[indices[1]]+")");
        // setDisabledAnswersIndices(indices);
        return indices;
    }


    return (
        <>
            {/* {console.log("Question Display rendering")} */}
            {/* {console.log("answer buttons ARE "+(answerButtonsDisabled ? "" : "NOT") + " disabled")} */}

            <div><p>{question}</p></div>

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
            <LifelineDisplay
                lifelineFunctions={lifelineFunctions}
                lifelinesRemaining={lifelinesRemaining}
            />
        </>
    );

}


