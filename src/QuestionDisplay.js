import React, { useState, useEffect, useRef, PureComponent } from 'react'
import AnswerButton from './AnswerButton'
import LifelineDisplay from './LifelineDisplay'

// @TODO:
// Merge gotoNextQuestion and incorrectAnswerSelected into single function 'handleSelection'
export default function QuestionDisplay({ question, correctAnswer, incorrectAnswers, difficulty, handleSelection, answerButtonsDisabled, lifelineSetters, lifelinesRemaining }) {

    const [answers, setAnswers] = useState(null);
    const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([]);
    const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false);
    const [papSuggestedAnswer, setPapSuggestedAnswer] = useState(null);

    let randomOrder = useRef();

    const selectAnswer = (answerCorrectness) => {
        handleSelection(answerCorrectness);
        setFiftyFiftyActive(false);
        setDisabledAnswersIndices([]);
    }

    useEffect(() => {
        // reset state from prev question
        setFiftyFiftyActive(false);
        setPapSuggestedAnswer(null);

        randomOrder = computeRandomOrder([correctAnswer, ...incorrectAnswers].length);
        // console.log("ORDER: " +randomOrder);
        // console.log(JSON.stringify([correctAnswer, ...incorrectAnswers]));
        const reordered = reorderAnswers(randomOrder);
        // console.log(JSON.stringify(reordered));
        setAnswers(reordered);
        console.log("Difficulty: "+difficulty);
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
            console.log("50:50 active: "+fiftyFiftyActive);
            if (fiftyFiftyActive) {
                const successChance = { // since only 2 options the friend will have a higher success chance than she otherwise would
                    easy: 0.9,
                    medium: 0.75,
                    hard: 0.65
                }

                console.log("Success chance: "+successChance[difficulty]);

                // roll random number and use q difficulty to see if the correct answer will be suggested
                const n = Math.random();
                console.log("Rolled: "+n+" ["+(n <= successChance[difficulty] ? "success":"fail")+"]");
                if (n <= successChance[difficulty]) {
                    console.log("Suggests: "+correctAnswer);
                    setPapSuggestedAnswer(correctAnswer);
                } else {
                    // get the index of the still-enabled incorrect answer
                    const correctAnswerIndex = answers.indexOf(correctAnswer);
                    let suggestedAnswerIndex = -1;
                    for (let i = 0; i < answers.length; i++) {
                        if (i != correctAnswerIndex && disabledAnswersIndices.indexOf(i) === -1) suggestedAnswerIndex = i; break;   
                    }
                    if (suggestedAnswerIndex === -1) console.log("Something went wrong")
                    else {
                        console.log("Suggests: "+answers[suggestedAnswerIndex]);
                        setPapSuggestedAnswer(answers[suggestedAnswerIndex]);
                    }
                }
            } else {    // fifty-fifty not active
                const successChance = {
                    easy: 0.85,
                    medium: 0.65,
                    hard: 0.35
                }

                console.log("Success chance: "+successChance[difficulty]);

                // now roll a random number and use the question difficulty success chance to determine whether the friend will suggest the correct answer
                const n = Math.random();
                console.log("Rolled: "+n+" ["+(n <= successChance[difficulty] ? "success":"fail")+"]");
                if (n <= successChance[difficulty]) { 
                    console.log("Suggests: "+correctAnswer);
                    setPapSuggestedAnswer(correctAnswer);
                } else { 
                    // pull one of the incorrect answers at random
                    const index = Math.floor(Math.random()*3);
                    console.log("Suggests: "+incorrectAnswers[index]);
                    setPapSuggestedAnswer(incorrectAnswers[index]);
                }
            }
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
            <hr />
            <LifelineDisplay
                lifelineFunctions={lifelineFunctions}
                lifelinesRemaining={lifelinesRemaining}
            />
            {papSuggestedAnswer && <p>"I expect the answer is {papSuggestedAnswer}"</p>}
            <hr />
        </>
    );

}


