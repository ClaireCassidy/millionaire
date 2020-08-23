import React, { useState, useEffect } from 'react'
import AnswerButton from './AnswerButton'
// import LifelineDisplay from './LifelineDisplay'
import BarChart from './BarChart'
import './QuestionDisplay.css'

export default function QuestionDisplay({ question, correctAnswer, difficulty, handleSelection, answerButtonsDisabled, answers, disabledAnswersIndices, fiftyFiftyActive }) {

    //const [answers, setAnswers] = useState(null);
    //const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([]);
    //const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false);
    // const [papSuggestedAnswer, setPapSuggestedAnswer] = useState(null);
    // const [askTheAudienceActive, setAskTheAudienceActive] = useState(false);
    // const [askTheAudienceHeights, setAskTheAudienceHeights] = useState([]);

    //let randomOrder = useRef();

    const selectAnswer = (answerCorrectness) => {
        handleSelection(answerCorrectness);
        //setFiftyFiftyActive(false);
        // setDisabledAnswersIndices([]);
    }

    // useEffect(() => {
    //     // reset state from prev question
    //     //setFiftyFiftyActive(false);
    //     //setPapSuggestedAnswer(null);

    //     //randomOrder = computeRandomOrder([correctAnswer, ...incorrectAnswers].length);
    //     // console.log("ORDER: " +randomOrder);
    //     // console.log(JSON.stringify([correctAnswer, ...incorrectAnswers]));
    //     //const reordered = reorderAnswers(randomOrder);
    //     // console.log(JSON.stringify(reordered));
    //     //setAnswers(reordered);
    //     console.log("Difficulty: " + difficulty);
    //     //setDisabledAnswersIndices(generateDisabledAnswersIndices(reordered));
    //     setAskTheAudienceActive(false);
        
    // }, [question]);

    // const computeRandomOrder = (length) => {
    //     let orderArr = new Array(length);
    //     for (let i = 0; i < orderArr.length; i++) {
    //         orderArr[i] = i;
    //     }

    //     orderArr.sort(() => Math.random() - 0.5);
    //     return orderArr;
    // }

    // const lifelineFunctions = {
    //     fiftyFifty: () => {
    //         console.log("Fifty Fifty Activated");
    //         //console.log(disabledAnswersIndices)
    //         console.log("Disabling answers \"" + answers[disabledAnswersIndices[0]] + ", \"" + answers[disabledAnswersIndices[1]] + "\"")
    //         setFiftyFiftyActive(true);
    //         lifelineSetters.disableFiftyFifty();
    //     },

    //     phoneAFriend: () => {
    //         console.log("Phone a Friend Activated");
    //         console.log("50:50 active: " + fiftyFiftyActive);
    //         if (fiftyFiftyActive) {
    //             const successChance = { // since only 2 options the friend will have a higher success chance than she otherwise would
    //                 easy: 0.9,
    //                 medium: 0.75,
    //                 hard: 0.65
    //             }

    //             console.log("Success chance: " + successChance[difficulty]);

    //             // roll random number and use q difficulty to see if the correct answer will be suggested
    //             const n = Math.random();
    //             console.log("Rolled: " + n + " [" + (n <= successChance[difficulty] ? "success" : "fail") + "]");
    //             if (n <= successChance[difficulty]) {
    //                 console.log("Suggests: " + correctAnswer);
    //                 setPapSuggestedAnswer(correctAnswer);
    //             } else {
    //                 // get the index of the still-enabled incorrect answer
    //                 const correctAnswerIndex = answers.indexOf(correctAnswer);
    //                 let suggestedAnswerIndex = -1;
    //                 for (let i = 0; i < answers.length; i++) {
    //                     if (i != correctAnswerIndex && disabledAnswersIndices.indexOf(i) === -1) suggestedAnswerIndex = i; break;
    //                 }
    //                 if (suggestedAnswerIndex === -1) console.log("Something went wrong")
    //                 else {
    //                     console.log("Suggests: " + answers[suggestedAnswerIndex]);
    //                     setPapSuggestedAnswer(answers[suggestedAnswerIndex]);
    //                 }
    //             }
    //         } else {    // fifty-fifty not active
    //             const successChance = {
    //                 easy: 0.85,
    //                 medium: 0.65,
    //                 hard: 0.35
    //             }

    //             console.log("Success chance: " + successChance[difficulty]);

    //             // now roll a random number and use the question difficulty success chance to determine whether the friend will suggest the correct answer
    //             const n = Math.random();
    //             console.log("Rolled: " + n + " [" + (n <= successChance[difficulty] ? "success" : "fail") + "]");
    //             if (n <= successChance[difficulty]) {
    //                 console.log("Suggests: " + correctAnswer);
    //                 setPapSuggestedAnswer(correctAnswer);
    //             } else {
    //                 // pull one of the incorrect answers at random
    //                 const index = Math.floor(Math.random() * 3);
    //                 console.log("Suggests: " + incorrectAnswers[index]);
    //                 setPapSuggestedAnswer(incorrectAnswers[index]);
    //             }
    //         }
    //         lifelineSetters.disablePhoneAFriend();
    //     },

    //     askTheAudience: () => {
    //         console.log("Ask the Audience Activated");

    //         setAskTheAudienceActive(true);
    //         //setAskTheAudienceHeights([0.25, 0.3, 0.25, 0.1]);
    //         // returns object in the form {correctAnswer%age: ..., [incorrectAnswerPercentages ... ]}
    //         // So we need to map these percentages back to the A, B, C, D answer they correspond to
    //         // Really we just need to note the position of the Correct answer, and can assign incorrect answer percentages arbitrarily among the remaining answers
    //         const answerPercentages = generateAskTheAudiencePercentages(fiftyFiftyActive, difficulty);
    //         console.log(JSON.stringify(answerPercentages));
    //         const correctAnswerIndex = answers.indexOf(correctAnswer);
    //         console.log(`Correct Answer Index: ${correctAnswerIndex}`);
    //         let orderedAnswerPercentages = [...answerPercentages.wrongAnswerPercentages]
    //         orderedAnswerPercentages.splice(correctAnswerIndex, 0, answerPercentages.correctAnswerPercentage);
    //         console.log(orderedAnswerPercentages);
    //         setAskTheAudienceHeights(orderedAnswerPercentages);

    //         lifelineSetters.disableAskTheAudience();
    //     }
    // }

    // const reorderAnswers = (indexingArray) => {

    //     let ans = [];

    //     for (let i = 0; i < indexingArray.length; i++) {
    //         ans.push([correctAnswer, ...incorrectAnswers][indexingArray[i]]);
    //     }

    //     // console.log(ans);
    //     return ans;
    // }

    // const generateDisabledAnswersIndices = (answers) => {

    //     // Just disable the first two answers in the incorrectAnswers prop (they'll be in a random spot in answers)
    //     let indices = [];
    //     let incorrectRandomised = incorrectAnswers.slice().sort(() => 0.5 - Math.random());
    //     indices.push(answers.indexOf(incorrectRandomised[0]));
    //     indices.push(answers.indexOf(incorrectRandomised[1]));
    //     console.log("correct answer: " + correctAnswer + ", disabling indices " + indices + " (" + answers[indices[0]] + ", " + answers[indices[1]] + ")");
    //     // setDisabledAnswersIndices(indices);
    //     return indices;
    // }


    return (
        <div className="QuestionDisplayContainer">
            {/* {console.log("Question Display rendering")} */}
            {/* {console.log("answer buttons ARE "+(answerButtonsDisabled ? "" : "NOT") + " disabled")} */}

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
            {/* <LifelineDisplay
                lifelineFunctions={lifelineFunctions}
                lifelinesRemaining={lifelinesRemaining}
            /> */}
            {/* {papSuggestedAnswer && <p>"I expect the answer is <b>{papSuggestedAnswer}</b>"</p>} */}
            {/* {askTheAudienceActive &&
                <>
                    <BarChart yValues={askTheAudienceHeights} />
                </>
            } */}
        </div>
    );

}

// const generateAskTheAudiencePercentages = (fiftyFiftyActive, questionDifficulty) => {

//     console.log(`Generating Ask the Audience Percentages ...\n\tFifty-Fifty Active: ${fiftyFiftyActive}\n\tQuestion Difficulty: ${questionDifficulty}`);

//     // Audience percentage a function of question difficulty & number of possible choices
//     if (fiftyFiftyActive) {

//         const biases = {
//             easy: {
//                 offset: 0.8,
//                 stdDev: 0.15
//             },
//             medium: {
//                 offset: 0.6,
//                 stdDev: 0.15
//             },
//             hard: {
//                 offset: 0.5,
//                 stdDev: 0.1
//             }
//         }

//         const offset = biases[questionDifficulty].offset;
//         const stdDev = biases[questionDifficulty].stdDev;

//         const bias = (Math.random() * (2 * stdDev)) - stdDev;
//         const correctAnswerPercentage = offset + bias;
//         const incorrectAnswerPercentage = 1 - correctAnswerPercentage;

//         // console.log("Offset: "+)
//         return {
//             correctAnswerPercentage: correctAnswerPercentage,
//             wrongAnswerPercentages: [incorrectAnswerPercentage]
//         };

//     } else {

//         const biases = {
//             easy: {
//                 offset: 0.65,
//                 stdDev: 0.2
//             },
//             medium: {
//                 offset: 0.5,
//                 stdDev: 0.2
//             },
//             hard: {
//                 offset: 0.3,
//                 stdDev: 0.15
//             }
//         }

//         const offset = biases[questionDifficulty].offset;
//         const stdDev = biases[questionDifficulty].stdDev;

//         const bias = ((Math.random() * (2 * stdDev)) - stdDev);
//         const correctAnswerPercentage = offset + bias;

//         let percentageRemaining = 1 - correctAnswerPercentage;
//         const wrongAnswer1Percentage = Math.random() * percentageRemaining;
//         percentageRemaining -= wrongAnswer1Percentage;
//         const wrongAnswer2Percentage = Math.random() * percentageRemaining;
//         percentageRemaining -= wrongAnswer2Percentage;
//         const wrongAnswer3Percentage = percentageRemaining;

//         return {
//             correctAnswerPercentage: correctAnswerPercentage,
//             wrongAnswerPercentages: [wrongAnswer1Percentage, wrongAnswer2Percentage, wrongAnswer3Percentage]
//         }
//     }
// }
