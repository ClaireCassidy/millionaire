import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import QuestionDisplay from './QuestionDisplay';
import SidePanel from './SidePanel';
import PortraitWindow from './PortraitWindow';
// import image from './temp-user-image.jpg';

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;
const PRIZE_MONEY_INCREMENTS = [500, 1000, 4000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE_INDICES = [0, 3, 6];
const NUM_EASY_QS = 3;
const NUM_MED_QS = 4;
const NUM_HARD_QS = 3;

function App() {

  // DEBUG
  const [debug, setDebug] = useState(true);

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls
  const [loadingStates, setloadingStates] = useState({ easy: true, medium: true, hard: true });
  const [initialLoad, setInitialLoad] = useState(true);
  // track index of cur question being asked
  const [curQuestionIndex, setCurQuestionIndex] = useState(0);
  const [curQuestion, setCurQuestion] = useState(null);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  // Track the last correct answer for printing
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState(null);
  // track the cash the user has currently accumulated and the 'safety net' cash prize
  const [curCash, setCurCash] = useState(0);
  const [curMinCash, setCurMinCash] = useState(0);
  // Toggling this triggers the use effect which fetches new questions
  const [gameOver, setGameOver] = useState(false);
  // Toggle this to set if the user voluntarily left the game (game ends but they get to keep the current cash value vs. nearest safety net)
  const [userRetired, setUserRetired] = useState(false);
  // Governs whether or not answer buttons should be active
  const [answerButtonsDisabled, setAnswerButtonsDisabled] = useState(false);
  // Track which lifelines are still available
  const [lifelinesRemaining, setLifelinesRemaining] = useState({ fiftyFifty: true, phoneAFriend: true, askTheAudience: true })

  //Hoisted from Question Display
  // const [answers, setAnswers] = useState(null);
  // const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([]);

  const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false);
  const [papSuggestedAnswer, setPapSuggestedAnswer] = useState(null);
  const [askTheAudienceActive, setAskTheAudienceActive] = useState(false);

  const [answers, setAnswers] = useState(null);
  const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([]);

  // Generates query strings, queries the API, and sets the app questions as per the API response
  useEffect(() => {
    // console.log("HOOK load questions executing ... ")

    loadNewQuestions();

  }, []);

  // prompt update of question displayed; occurs once when loading complete to load first question, then again whenever the curQuestionIndex is modified (i.e. by answering a question)
  useEffect(() => {
    // console.log("HOOK update question displayed ... ")

    // console.log("Loading states changed, checking ... " + JSON.stringify(loadingStates));
    if (doneLoadingQuestions(loadingStates)) {

      if (initialLoad) {
        // if this is the inital loading of a q, we need to sort the qs
        const questionOrder = {
          easy: 0,
          medium: 1,
          hard: 2
        }

        let qs = questions.slice().sort((a, b) => {
          return questionOrder[a.difficulty] - questionOrder[b.difficulty];
        });
        //console.log("Q's Sorted: "+JSON.stringify(qs));
        setQuestions(qs);
        setCurQuestion(qs[0]);
        setInitialLoad(false);

        const randomOrder = computeRandomOrder([qs[0].correctAnswer, ...qs[0].incorrectAnswers].length);
        const reordered = reorderAnswers(randomOrder, qs[0]);
        setAnswers(reordered);
        setDisabledAnswersIndices(generateDisabledAnswersIndices(reordered, qs[0]));

      } else {

        let q = questions[curQuestionIndex];
        console.log(q);
        
        // update the current question
        setCurQuestion(q);

        const randomOrder = computeRandomOrder([q.correctAnswer, ...q.incorrectAnswers].length);
        const reordered = reorderAnswers(randomOrder, q);
        setAnswers(reordered);
        setDisabledAnswersIndices(generateDisabledAnswersIndices(reordered, q));
      }
    }

  }, [loadingStates, curQuestionIndex]);

  // Remove HTML encoded characters from API strings (hack):
  function decodeStr(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  // TODO: Don't check that incoming responses are in the order EASY, MEDIUM, HARD, so we accidentally put hard q's first, followed by med etc.
  // Sol: Sort questions according to difficulty when pushing to questions
  const loadNewQuestions = () => {

    // generate query text based on number of questions of specified difficulty required
    const queries = generateApiQueries({ easy: NUM_EASY_QS, medium: NUM_MED_QS, hard: NUM_HARD_QS });

    try {
      queries.forEach(query => {
        axios.get(query)
          .then(res => {
            //extract the questions into an array
            let qsReceived = res.data.results;

            // convert the responses into Question objects
            qsReceived = qsReceived.map(q => {
              return new Question(decodeStr(q.question), decodeStr(q.correct_answer), q.incorrect_answers.map(str => decodeStr(str)), q.difficulty);
            });

            // console.log(qsReceived);
            const difficulty = qsReceived[0].difficulty;
            // console.log("received q's for difficulty: "+difficulty);

            // push the Question objects to the question pool 
            setQuestions(questions => [...questions, ...qsReceived]);

            // we're finished loading questions at the current difficulty level
            // console.log(JSON.stringify(loadingStates))
            // console.log("Setting difficulty for "+difficulty+" ... ")
            setloadingStates(loadingStates => ({ ...loadingStates, [difficulty]: false }));

          })
      });
    } catch (e) {
      console.log("Error fetching questions");
    }
  }


  const reload = () => {
    console.log("RELOADING")
    setQuestions([]);
    setCurQuestion(null);
    setCurQuestionIndex(0);
    setInitialLoad(true);
    setloadingStates({ easy: true, medium: true, hard: true });
    setLifelinesRemaining({ fiftyFifty: true, phoneAFriend: true, askTheAudience: true });
    setAllQuestionsAnswered(false);
    setCurCash(0);
    setCurMinCash(0);
    setAnswerButtonsDisabled(false);
    setLastCorrectAnswer(null);
    setGameOver(false);
    setUserRetired(false);
    loadNewQuestions();
  }

  const userRetire = () => {
    setUserRetired(true);
    setGameOver(true);
    setAnswerButtonsDisabled(true);
  }

  const handleSelection = (answeredCorrectly) => {

    setLastCorrectAnswer(curQuestion.correctAnswer);

    if (answeredCorrectly) {

      console.log("CORRECTLY ANSWERED");
      gotoNextQuestion();

    } else {

      console.log("INCORRECTLY ANSWERED");
      setGameOver(true);
      setAnswerButtonsDisabled(true);
      //reload();

    }
  }

  const gotoNextQuestion = () => {
    if (curQuestionIndex < NUM_QS - 1) {

      // update the prize money the player has accumulated
      setCurCash(PRIZE_MONEY_INCREMENTS[curQuestionIndex]);

      const index = SAFE_INDICES.indexOf(curQuestionIndex);
      if (index >= 0) {
        console.log("hit safety net");
        setCurMinCash(PRIZE_MONEY_INCREMENTS[SAFE_INDICES[index]]);
      }

      // update the question to be displayed
      setCurQuestionIndex(curQuestionIndex => curQuestionIndex + 1);

      //reset state from previous question
      setFiftyFiftyActive(false);
      setAskTheAudienceActive(false);
      setPapSuggestedAnswer(null);

    } else {
      setAllQuestionsAnswered(true);
      console.log("End of q's");
    }
    //console.log(curQuestionIndex);
  }

  const lifelineSetters = {
    disableFiftyFifty: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, fiftyFifty: false })) },
    disablePhoneAFriend: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, phoneAFriend: false })) },
    disableAskTheAudience: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, askTheAudience: false })) }
  }

  const lifelineFunctions = {

    fiftyFifty: () => {
      console.log("Fifty-Fifty Activated");
      setFiftyFiftyActive(true);

      console.log("!!!!"+JSON.stringify(curQuestion));
      console.log("\tanswers: "+answers);
      console.log("\tdisabled indices: "+disabledAnswersIndices);
    },

    phoneAFriend: () => {
      console.log("Phone-a-Friend Activated");
      if (fiftyFiftyActive) {

        const successChance = { // since only 2 options the friend will have a higher success chance than she otherwise would
          easy: 0.9,
          medium: 0.75,
          hard: 0.65
        }

        console.log("Success chance: " + successChance[curQuestion.difficulty]);


        // roll random number and use q difficulty to see if the correct answer will be suggested
        const n = Math.random();
        console.log("Rolled: " + n + " [" + (n <= successChance[curQuestion.difficulty] ? "success" : "fail") + "]");
        if (n <= successChance[curQuestion.difficulty]) {
          console.log("Suggests: " + curQuestion.correctAnswer);
          setPapSuggestedAnswer(curQuestion.correctAnswer);
        } else {
          // get the index of the still-enabled incorrect answer
          const correctAnswerIndex = answers.indexOf(curQuestion.correctAnswer);
          let suggestedAnswerIndex = -1;
          for (let i = 0; i < answers.length; i++) {
            if (i != curQuestion.correctAnswerIndex && disabledAnswersIndices.indexOf(i) === -1) suggestedAnswerIndex = i; break;
          }
          if (suggestedAnswerIndex === -1) console.log("Something went wrong")
          else {
            console.log("Suggests: " + answers[suggestedAnswerIndex]);
            setPapSuggestedAnswer(answers[suggestedAnswerIndex]);
          }
        }


      } else { // fifty-fifty not active

        const successChance = {
          easy: 0.85,
          medium: 0.65,
          hard: 0.35
        }

        console.log("Success chance: " + successChance[curQuestion.difficulty]);

        // now roll a random number and use the question difficulty success chance to determine whether the friend will suggest the correct answer

        const n = Math.random();
        console.log("Rolled: " + n + " [" + (n <= successChance[curQuestion.difficulty] ? "success" : "fail") + "]");
        if (n <= successChance[curQuestion.difficulty]) {
          console.log("Suggests: " + curQuestion.correctAnswer);
          setPapSuggestedAnswer(curQuestion.correctAnswer);
        } else {
          // pull one of the incorrect answers at random
          const index = Math.floor(Math.random() * 3);
          console.log("Suggests: " + curQuestion.incorrectAnswers[index]);
          setPapSuggestedAnswer(curQuestion.incorrectAnswers[index]);
        }
      }
      lifelineSetters.disablePhoneAFriend();
  },

    askTheAudience: () => {
      console.log("Ask-the-Audience Activated");
}
  }

// const lifelineFunctions = {
//   fiftyFifty: () => {
//     console.log("Fifty Fifty Activated");
//     //console.log(disabledAnswersIndices)
//     console.log("Disabling answers \"" + answers[disabledAnswersIndices[0]] + ", \"" + answers[disabledAnswersIndices[1]] + "\"")
//     setFiftyFiftyActive(true);
//     lifelineSetters.disableFiftyFifty();
//   },

//   phoneAFriend: () => {
//     console.log("Phone a Friend Activated");
//     console.log("50:50 active: " + fiftyFiftyActive);
//     if (fiftyFiftyActive) {
//       const successChance = { // since only 2 options the friend will have a higher success chance than she otherwise would
//         easy: 0.9,
//         medium: 0.75,
//         hard: 0.65
//       }

//       console.log("Success chance: " + successChance[difficulty]);

//       // roll random number and use q difficulty to see if the correct answer will be suggested
//       const n = Math.random();
//       console.log("Rolled: " + n + " [" + (n <= successChance[difficulty] ? "success" : "fail") + "]");
//       if (n <= successChance[difficulty]) {
//         console.log("Suggests: " + correctAnswer);
//         setPapSuggestedAnswer(correctAnswer);
//       } else {
//         // get the index of the still-enabled incorrect answer
//         const correctAnswerIndex = answers.indexOf(correctAnswer);
//         let suggestedAnswerIndex = -1;
//         for (let i = 0; i < answers.length; i++) {
//           if (i != correctAnswerIndex && disabledAnswersIndices.indexOf(i) === -1) suggestedAnswerIndex = i; break;
//         }
//         if (suggestedAnswerIndex === -1) console.log("Something went wrong")
//         else {
//           console.log("Suggests: " + answers[suggestedAnswerIndex]);
//           setPapSuggestedAnswer(answers[suggestedAnswerIndex]);
//         }
//       }
//     } else {    // fifty-fifty not active
//       const successChance = {
//         easy: 0.85,
//         medium: 0.65,
//         hard: 0.35
//       }

//       console.log("Success chance: " + successChance[difficulty]);

//       // now roll a random number and use the question difficulty success chance to determine whether the friend will suggest the correct answer
//       const n = Math.random();
//       console.log("Rolled: " + n + " [" + (n <= successChance[difficulty] ? "success" : "fail") + "]");
//       if (n <= successChance[difficulty]) {
//         console.log("Suggests: " + correctAnswer);
//         setPapSuggestedAnswer(correctAnswer);
//       } else {
//         // pull one of the incorrect answers at random
//         const index = Math.floor(Math.random() * 3);
//         console.log("Suggests: " + incorrectAnswers[index]);
//         setPapSuggestedAnswer(incorrectAnswers[index]);
//       }
//     }
//     lifelineSetters.disablePhoneAFriend();
//   },

//   askTheAudience: () => {
//     console.log("Ask the Audience Activated");

//     setAskTheAudienceActive(true);
//     //setAskTheAudienceHeights([0.25, 0.3, 0.25, 0.1]);
//     // returns object in the form {correctAnswer%age: ..., [incorrectAnswerPercentages ... ]}
//     // So we need to map these percentages back to the A, B, C, D answer they correspond to
//     // Really we just need to note the position of the Correct answer, and can assign incorrect answer percentages arbitrarily among the remaining answers
//     const answerPercentages = generateAskTheAudiencePercentages(fiftyFiftyActive, difficulty);
//     console.log(JSON.stringify(answerPercentages));
//     const correctAnswerIndex = answers.indexOf(correctAnswer);
//     console.log(`Correct Answer Index: ${correctAnswerIndex}`);
//     let orderedAnswerPercentages = [...answerPercentages.wrongAnswerPercentages]
//     orderedAnswerPercentages.splice(correctAnswerIndex, 0, answerPercentages.correctAnswerPercentage);
//     console.log(orderedAnswerPercentages);
//     setAskTheAudienceHeights(orderedAnswerPercentages);

//     lifelineSetters.disableAskTheAudience();
//   }
// }

return (
  <>
    {curQuestion ?

      <div className="App">

        <div className="MainWindow">
          <PortraitWindow className="PortraitWindow"
            imagePath={"./images/image1.jpg"}
            lastCorrectAnswer={lastCorrectAnswer}
            answeredCorrectly={curQuestionIndex !== 0 && !gameOver}
          />
          <QuestionDisplay className="QuestionDisplay"
            question={curQuestion.questionText}
            correctAnswer={curQuestion.correctAnswer}
            incorrectAnswers={curQuestion.incorrectAnswers}
            difficulty={curQuestion.difficulty}
            handleSelection={handleSelection}
            answerButtonsDisabled={answerButtonsDisabled}
            lifelineSetters={lifelineSetters}
            lifelinesRemaining={lifelinesRemaining}
            answers={answers}
            disabledAnswersIndices={disabledAnswersIndices}
            fiftyFiftyActive={fiftyFiftyActive}
          />
        </div>
        <div className="SideWindow">
          <SidePanel
            prizeAmountsInfo={{
              increments: PRIZE_MONEY_INCREMENTS,
              safeIndices: SAFE_INDICES,
              curQuestionIndex: curQuestionIndex,
              numQs: NUM_QS
            }}
            lifelinesInfo={{
              lifelineFunctions: lifelineFunctions,
              lifelinesRemaining: lifelinesRemaining
            }}
          />
        </div>
      </div>
      : <p>Loading...</p>}
  </>
);

}

const doneLoadingQuestions = loadingStates => {

  for (let difficulty in loadingStates) {
    //console.log(difficulty+": "+loadingStates[difficulty])
    if (loadingStates[difficulty]) return false;
  }

  return true;

}



const generateApiQueries = request => {
  // request an object of the form {easy: n1, medium: n2, hard: n3}
  // returns an array of objects containing the queries for each difficulty level
  if (typeof request === "object") {

    const queries = [];

    Object.keys(request).forEach(function (key) {

      const difficulty = key;
      const amount = request[key];

      const query = `${BASE_API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`;
      //console.log(query);
      queries.push(query);
    });

    return queries;
  } else console.log(typeof request);

}

class Question {
  constructor(questionText, correctAnswer, incorrectAnswers, difficulty) {
    this._questionText = questionText;
    this._correctAnswer = correctAnswer;
    this._incorrectAnswers = incorrectAnswers;
    this._difficulty = difficulty;
  }

  get questionText() {
    return this._questionText;
  }

  get correctAnswer() {
    return this._correctAnswer;
  }

  get incorrectAnswers() {
    return this._incorrectAnswers;
  }

  get difficulty() {
    return this._difficulty;
  }
}

const computeRandomOrder = (length) => {
  let orderArr = new Array(length);
  for (let i = 0; i < orderArr.length; i++) {
      orderArr[i] = i;
  }

  orderArr.sort(() => Math.random() - 0.5);
  return orderArr;
}

const reorderAnswers = (indexingArray, question) => {

  let ans = [];

  for (let i = 0; i < indexingArray.length; i++) {
      ans.push([question.correctAnswer, ...question.incorrectAnswers][indexingArray[i]]);
  }

  // console.log(ans);
  return ans;
}

const generateDisabledAnswersIndices = (answers, q) => {
  console.log("From generate... : \n"+q);
  // Just disable the first two answers in the incorrectAnswers prop (they'll be in a random spot in answers)
  let indices = [];
  let incorrectRandomised = q.incorrectAnswers.slice().sort(() => 0.5 - Math.random());
  indices.push(answers.indexOf(incorrectRandomised[0]));
  indices.push(answers.indexOf(incorrectRandomised[1]));
  console.log("correct answer: " + q.correctAnswer + ", disabling indices " + indices + " (" + answers[indices[0]] + ", " + answers[indices[1]] + ")");
  // setDisabledAnswersIndices(indices);
  return indices;
}

export default App;



  // return (
  //   <div className="App">
  //     {/* {console.log("Done?: " + doneLoadingQuestions(loadingStates))} */}
  //     {debug && <button onClick={() => setCurQuestionIndex(9)}>Skip</button>}

  //     {(curQuestion
  //       ?
  //       (allQuestionsAnswered ?
  //         <>
  //           <h2>Congrats!</h2>
  //           <p>You're a Millionaire! :)</p>
  //           <button onClick={() => reload()}>Play Again</button>
  //         </>
  //         :
  //         <>
  //           <QuestionDisplay className="QuestionDisplay"
  //             question={curQuestion.questionText}
  //             correctAnswer={curQuestion.correctAnswer}
  //             incorrectAnswers={curQuestion.incorrectAnswers}
  //             difficulty={curQuestion.difficulty}
  //             handleSelection={handleSelection}
  //             answerButtonsDisabled={answerButtonsDisabled}
  //             lifelineSetters={lifelineSetters}
  //             lifelinesRemaining={lifelinesRemaining}
  //           />
  //           <SidePanel className="SidePanel"
  //             increments={PRIZE_MONEY_INCREMENTS}
  //             safeIndices={SAFE_INDICES}
  //             curQuestionIndex={curQuestionIndex}
  //             numQs={NUM_QS}
  //           />
  //           {!gameOver && lastCorrectAnswer && <p><b>Correct!</b> The answer was {lastCorrectAnswer}</p>}
  //           {gameOver && <p>{!userRetired && <b>Incorrect!</b>} The answer was {curQuestion.correctAnswer}</p>}
  //           {gameOver && <h3><b>Game Over!</b> Your winnings are <b>{(!userRetired && curMinCash)}{(userRetired && curCash)}</b></h3>}
  //           {gameOver && <button onClick={() => reload()}>Replay</button>}
  //           {!gameOver && <button onClick={() => userRetire()}>Leave w/ cash</button>}
  //           <p>Current Cash: <b>{curCash}</b>, Cur Min Cash: <b>{curMinCash}</b></p>
  //         </>)
  //       : 
  //       <p>Loading...</p>)}
  //   </div>
  // );
