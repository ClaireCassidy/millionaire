import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import QuestionDisplay from './QuestionDisplay';
import SidePanel from './SidePanel';

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;
const PRIZE_MONEY_INCREMENTS = [500, 1000, 4000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE_INDICES = [2, 5];

function App() {

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls
  const [loadingStates, setloadingStates] = useState({ easy: true, medium: true, hard: true });
  // track index of cur question being asked
  const [curQuestionIndex, setCurQuestionIndex] = useState(0);
  const [curQuestionText, setCurQuestionText] = useState(null);
  const [curCorrectAnswer, setCurCorrectAnswer] = useState(null);
  const [curIncorrectAnswers, setCurIncorrectAnswers] = useState([]);

  useEffect(() => {
    const queries = generateApiQueries({ easy: 3, medium: 4, hard: 3 });

    console.log(queries);

    const ress = queries.forEach(query => {
      //console.log(query);
      axios.get(query)
        .then(res => {

          // pull the questions
          const qsReceived = res.data.results;
          //console.log(qsReceived);

          // get the difficulty of the set of questions received
          const difficulty = qsReceived[0].difficulty;

          // update the question pool
          setQuestions(questions => [...questions, ...qsReceived]);

          console.log(loadingStates[difficulty])
          // finish loading for cur difficulty
          setloadingStates(loadingStates => ({ ...loadingStates, [difficulty]: false }));
        })
    });

  }, []);

  // prompt update of question displayed; occurs once when loading complete to load first question, then again whenever the curQuestionIndex is modified (i.e. by answering a question)
  useEffect(() => {
    console.log("Loading states changed, checking ... " + JSON.stringify(loadingStates));
    if (doneLoadingQuestions(loadingStates)) {
      console.log("Questions received");

      const curQuestion = questions[curQuestionIndex];
      console.log(curQuestion);

      setCurQuestionText(decodeStr(curQuestion.question));
      setCurCorrectAnswer(decodeStr(curQuestion.correct_answer));
      setCurIncorrectAnswers(curQuestion.incorrect_answers.map(elem => {
        return decodeStr(elem);
      }));
    }

  }, [loadingStates, curQuestionIndex]);

  const isDoneLoading = doneLoadingQuestions(loadingStates);

  // @TODO: implement
  // Remove HTML encoded characters from API strings (hack):
  function decodeStr(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  const gotoNextQuestion = () => {
    if (curQuestionIndex < NUM_QS - 1) {
      setCurQuestionIndex(curQuestionIndex => curQuestionIndex + 1);
    } else console.log("End of q's");
    console.log(curQuestionIndex);
  }

  return (
    <div className="App">
      {console.log("Done?: " + doneLoadingQuestions(loadingStates))}
      {/* {console.log(JSON.stringify(questions, null, 2))} */}

      {/* {isDoneLoading 
      ? <QuestionDisplay 
          question={questions[0].question} 
          correctAnswer={questions[0].correct_answer} 
          incorrectAnswers={questions[0].incorrect_answers}
          gotoNextQuestion={gotoNextQuestion}/>
      : <p>Loading...</p>} */}
      {curQuestionText
        ? <>
          <QuestionDisplay
            question={curQuestionText}
            correctAnswer={curCorrectAnswer}
            incorrectAnswers={curIncorrectAnswers}
            gotoNextQuestion={gotoNextQuestion}
          />
          <SidePanel 
            increments={PRIZE_MONEY_INCREMENTS}
            safeIndices={SAFE_INDICES}
            curQuestionIndex={curQuestionIndex}
            numQs={NUM_QS}
            />
        </>
        : <p>Loading...</p>}
    </div>
  );

}

const doneLoadingQuestions = loadingStates => {

  for (let difficulty in loadingStates) {
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

export default App;
