import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import axios from 'axios';
import QuestionDisplay from './QuestionDisplay';
import SidePanel from './SidePanel';

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;
const PRIZE_MONEY_INCREMENTS = [500, 1000, 4000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE_INDICES = [3, 6];
const NUM_EASY_QS = 3;
const NUM_MED_QS = 4;
const NUM_HARD_QS = 3;

function App() {

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls
  const [loadingStates, setloadingStates] = useState({ easy: true, medium: true, hard: true });
  // track index of cur question being asked
  const [curQuestionIndex, setCurQuestionIndex] = useState(0);
  const [curQuestion, setCurQuestion] = useState(null);
  // track the cash the user has currently accumulated and the 'safety net' cash prize
  const [curCash, setCurCash] = useState(0);
  const [curMinCash, setCurMinCash] = useState(0);
  // Toggling this triggers the use effect which fetches new questions
  const [gameOver, setGameOver] = useState(false);
  // Governs whether or not answer buttons should be active
  const [answerButtonsDisabled, setAnswerButtonsDisabled] = useState(false);

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
      setCurQuestion(questions[curQuestionIndex]);
    }

  }, [loadingStates, curQuestionIndex]);

  //const isDoneLoading = doneLoadingQuestions(loadingStates);

  // @TODO: implement
  // Remove HTML encoded characters from API strings (hack):
  function decodeStr(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  const loadNewQuestions = () => {

    // generate query text based on number of questions of specified difficulty required
    const queries = generateApiQueries({ easy: NUM_EASY_QS, medium: NUM_MED_QS, hard: NUM_HARD_QS});

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
          setloadingStates(loadingStates => ({...loadingStates, [difficulty]: false}));

        })
    });
  }


  const reload = () => {
    console.log("RELOADING")
    setQuestions([]);
    setCurQuestion(null);
    setCurQuestionIndex(0);
    setloadingStates({easy: true, medium: true, hard: true});
    setCurCash(0);
    setCurMinCash(0);
    setAnswerButtonsDisabled(false);
    setGameOver(false);
    loadNewQuestions();
    // setGameOver(gameOver => !gameOver);
  }

  const handleSelection = (answeredCorrectly) => {

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

    } else console.log("End of q's");
    //console.log(curQuestionIndex);
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
            handleSelection={handleSelection}
            answerButtonsDisabled={answerButtonsDisabled}
          />
          <SidePanel 
            increments={PRIZE_MONEY_INCREMENTS}
            safeIndices={SAFE_INDICES}
            curQuestionIndex={curQuestionIndex}
            numQs={NUM_QS}
            />
            {console.log(gameOver)}
          {gameOver && <p><b>Game Over!</b></p>}
          <button onClick={() => reload()}>reload</button>
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
