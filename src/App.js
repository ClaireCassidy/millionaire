import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import axios from 'axios';
import QuestionDisplay from './QuestionDisplay';
import SidePanel from './SidePanel';

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;
const PRIZE_MONEY_INCREMENTS = [500, 1000, 4000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE_INDICES = [0, 3, 6];
const NUM_EASY_QS = 3;
const NUM_MED_QS = 4;
const NUM_HARD_QS = 3;

function App() {

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls
  const [loadingStates, setloadingStates] = useState({ easy: true, medium: true, hard: true });
  const [initialLoad, setInitialLoad] = useState(true);
  // track index of cur question being asked
  const [curQuestionIndex, setCurQuestionIndex] = useState(0);
  const [curQuestion, setCurQuestion] = useState(null);
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

      } else {
        setCurQuestion(questions[curQuestionIndex]);
      }
    }

  }, [loadingStates, curQuestionIndex]);

  //const isDoneLoading = doneLoadingQuestions(loadingStates);

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

    if (answeredCorrectly) {

      console.log("CORRECTLY ANSWERED");
      setLastCorrectAnswer(curQuestion.correctAnswer);
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

    } else console.log("End of q's");
    //console.log(curQuestionIndex);
  }

  const lifelineSetters = {
    disableFiftyFifty: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, fiftyFifty: false })) },
    disablePhoneAFriend: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, phoneAFriend: false })) },
    disableAskTheAudience: () => { setLifelinesRemaining(lifelinesRemaining => ({ ...lifelinesRemaining, askTheAudience: false })) }
  }

  return (
    <div className="App">
      {/* {console.log("Done?: " + doneLoadingQuestions(loadingStates))} */}

      {curQuestion
        ? <>
          <QuestionDisplay
            question={curQuestion.questionText}
            correctAnswer={curQuestion.correctAnswer}
            incorrectAnswers={curQuestion.incorrectAnswers}
            difficulty={curQuestion.difficulty}
            handleSelection={handleSelection}
            answerButtonsDisabled={answerButtonsDisabled}
            lifelineSetters={lifelineSetters}
            lifelinesRemaining={lifelinesRemaining}
          />
          <SidePanel
            increments={PRIZE_MONEY_INCREMENTS}
            safeIndices={SAFE_INDICES}
            curQuestionIndex={curQuestionIndex}
            numQs={NUM_QS}
          />
          {console.log(gameOver)}
          {!gameOver && lastCorrectAnswer && <p><b>Correct!</b> The answer was {lastCorrectAnswer}</p>}
          {gameOver && <p>{!userRetired && <b>Incorrect!</b>} The answer was {curQuestion.correctAnswer}</p>}
          {gameOver && <h3><b>Game Over!</b> Your winnings are <b>{(!userRetired && curMinCash)}{(userRetired && curCash)}</b></h3>}
          {gameOver && <button onClick={() => reload()}>Replay</button>}
          {!gameOver && <button onClick={() => userRetire()}>Leave w/ cash</button>}
          <p>Current Cash: <b>{curCash}</b>, Cur Min Cash: <b>{curMinCash}</b></p>
        </>
        : <p>Loading...</p>}
    </div>
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

export default App;
