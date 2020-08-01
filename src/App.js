import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import QuestionDisplay from './QuestionDisplay';

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;

function App() {

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls
  const [loadingStates, setloadingStates] = useState({easy: true, medium: true, hard: true});

  useEffect(() => {
    const queries = generateApiQueries({easy: 3, medium: 4, hard: 3});

    console.log(queries);

    const ress = queries.forEach(query => {
      //console.log(query);
      axios.get(query)
        .then( res => {

          // pull the questions
          const qsReceived = res.data.results;
          //console.log(qsReceived);

          // get the difficulty of the set of questions received
          const difficulty = qsReceived[0].difficulty;

          // update the question pool
          setQuestions(questions => [...questions, ...qsReceived]);

          console.log(loadingStates[difficulty])
          // finish loading for cur difficulty
          setloadingStates(loadingStates => ({...loadingStates, [difficulty]: false}));

        })
    });

  }, []);

  const isDoneLoading = doneLoadingQuestions(loadingStates);

  return (
    <div className="App">
      { console.log("Done?: "+doneLoadingQuestions(loadingStates))}
      {/* {console.log(JSON.stringify(questions, null, 2))} */}

      {isDoneLoading ? <p>{JSON.stringify(questions)}</p> : <p>Loading...</p>}
    </div>
  );
}

const doneLoadingQuestions = loadingStates => {

  for (let difficulty in loadingStates) {
    if (loadingStates[difficulty]) return false;
  }

  return true;
}

const generateApiQueries = request =>  {
  // request an object of the form {easy: n1, medium: n2, hard: n3}
  // returns an array of objects containing the queries for each difficulty level
  if (typeof request === "object") {

    const queries = [];

    Object.keys(request).forEach(function(key) {
      // console.log(typeof key + ":" + key);
      const difficulty = key;
      const amount = request[key];
      
      //console.log(difficulty+": "+amount);

      const query = `${BASE_API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`;
      //console.log(query);
      queries.push(query);
    });

    return queries;
  } else console.log(typeof request);
}

export default App;
