import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import QuestionDisplay from "./QuestionDisplay";
import SidePanel from "./SidePanel";
import PortraitWindow from "./PortraitWindow";
import GameOverScreen from "./GameOverScreen";

const BASE_API_URL = "https://opentdb.com/api.php";
const NUM_QS = 10;
const PRIZE_MONEY_INCREMENTS = [
  500,
  1000,
  4000,
  16000,
  32000,
  64000,
  125000,
  250000,
  500000,
  1000000,
];
const SAFE_INDICES = [3, 6, 9];
const NUM_EASY_QS = 3;
const NUM_MED_QS = 4;
const NUM_HARD_QS = 3;
const GAME_OVER_TYPES = {
  WIN: 0,
  RETIRE: 1,
  LOSE: 2
}

function App() {
  // DEBUG
  const [debug, setDebug] = useState(false);

  const [questions, setQuestions] = useState([]);
  // track progress of the individual API calls (one call per difficulty category)
  const [loadingStates, setloadingStates] = useState({
    easy: true,
    medium: true,
    hard: true,
  });
  const [initialLoad, setInitialLoad] = useState(true);
  // track index of cur question being asked
  const [curQuestionIndex, setCurQuestionIndex] = useState(0);
  const [curQuestion, setCurQuestion] = useState(null);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  // Track the last correct answer for printing
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState(null);
  // Toggling this triggers the use effect which fetches new questions
  const [gameOver, setGameOver] = useState(false);
  // Toggle this to set if the user voluntarily left the game (game ends but they get to keep the current cash value vs. nearest safety net)
  const [userRetired, setUserRetired] = useState(false);
  // Governs whether or not answer buttons should be active
  const [answerButtonsDisabled, setAnswerButtonsDisabled] = useState(false);
  // Track which lifelines are still available
  const [lifelinesRemaining, setLifelinesRemaining] = useState({
    fiftyFifty: true,
    phoneAFriend: true,
    askTheAudience: true,
  });

  // Keep track of active lifelines/their info
  const [fiftyFiftyActive, setFiftyFiftyActive] = useState(false);
  const [papSuggestedAnswer, setPapSuggestedAnswer] = useState(null);
  const [papComment, setPapComment] = useState(null);
  const [askTheAudienceActive, setAskTheAudienceActive] = useState(false);

  const [answers, setAnswers] = useState(null);
  const [disabledAnswersIndices, setDisabledAnswersIndices] = useState([]);
  const [askTheAudienceHeights, setAskTheAudienceHeights] = useState([]);

  // Generates query strings, queries the API, and sets the app questions as per the API response
  useEffect(() => {
    loadNewQuestions();
  }, []);

  // prompt update of question displayed; occurs once when loading complete to load first question, then again whenever the curQuestionIndex is modified (i.e. by answering a question)
  useEffect(() => {

    if (doneLoadingQuestions(loadingStates)) {
      if (initialLoad) {
        // if this is the inital loading of a q, we need to sort the qs
        const questionOrder = {
          easy: 0,
          medium: 1,
          hard: 2,
        };

        // Responses may be in incorrect order wrt difficulty, so sort before appending new questions
        let qs = questions.slice().sort((a, b) => {
          return questionOrder[a.difficulty] - questionOrder[b.difficulty];
        });

        setQuestions(qs);
        setCurQuestion(qs[0]);
        setInitialLoad(false);

        // Randomise the order answers are displayed (otherwise correct answer always first)
        const randomOrder = computeRandomOrder(
          [qs[0].correctAnswer, ...qs[0].incorrectAnswers].length
        );
        const reordered = reorderAnswers(randomOrder, qs[0]);
        setAnswers(reordered);

        // Pull two random incorrect answers to disable on 50:50 activation
        setDisabledAnswersIndices(
          generateDisabledAnswersIndices(reordered, qs[0])
        );

      } else {
        let q = questions[curQuestionIndex];

        // update the current question
        setCurQuestion(q);

        const randomOrder = computeRandomOrder(
          [q.correctAnswer, ...q.incorrectAnswers].length
        );
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

  const loadNewQuestions = () => {
    // generate query text based on number of questions of specified difficulty required
    const queries = generateApiQueries({
      easy: NUM_EASY_QS,
      medium: NUM_MED_QS,
      hard: NUM_HARD_QS,
    });

    try {
      queries.forEach((query) => {
        axios.get(query).then((res) => {
          //extract the questions into an array
          let qsReceived = res.data.results;

          // convert the responses into Question objects
          qsReceived = qsReceived.map((q) => {
            return new Question(
              decodeStr(q.question),
              decodeStr(q.correct_answer),
              q.incorrect_answers.map((str) => decodeStr(str)),
              q.difficulty
            );
          });

          const difficulty = qsReceived[0].difficulty;

          // push the Question objects to the question pool
          setQuestions((questions) => [...questions, ...qsReceived]);

          // we're finished loading questions at the current difficulty level
          setloadingStates((loadingStates) => ({
            ...loadingStates,
            [difficulty]: false,
          }));
        });
      });
    } catch (e) {
      console.log("Error fetching questions");
    }
  };

  const reload = () => {
    //reset app state
    console.log("RELOADING");
    setQuestions([]);
    setloadingStates({ easy: true, medium: true, hard: true });
    setInitialLoad(true);
    setCurQuestionIndex(0);
    setCurQuestion(null);
    setAllQuestionsAnswered(false);
    setLastCorrectAnswer(null);
    setGameOver(false);
    setUserRetired(false);
    setAnswerButtonsDisabled(false);
    setLifelinesRemaining({
      fiftyFifty: true,
      phoneAFriend: true,
      askTheAudience: true,
    });
    setPapSuggestedAnswer(null);
    setFiftyFiftyActive(false);
    setPapSuggestedAnswer(null);
    setAskTheAudienceActive(false);
    setAnswers(null);
    setDisabledAnswersIndices([]);
    setAskTheAudienceHeights([]);
    
    loadNewQuestions();
  };

  // The user voluntarily quit (takes all money they received so far)
  const userRetire = () => {
    setUserRetired(true);
    setGameOver(true);
    setAnswerButtonsDisabled(true);
  };

  // Called when user picks an answer
  const handleSelection = (answeredCorrectly) => {

    setLastCorrectAnswer(curQuestion.correctAnswer);

    if (answeredCorrectly) {
      console.log("CORRECTLY ANSWERED");
      gotoNextQuestion();
    } else {
      console.log("INCORRECTLY ANSWERED");
      setGameOver(true);
      setAnswerButtonsDisabled(true);
    }

  };

  const gotoNextQuestion = () => {

    if (curQuestionIndex < NUM_QS - 1) { // if qs left to answer

      // update the question to be displayed
      setCurQuestionIndex((curQuestionIndex) => curQuestionIndex + 1);

      //reset lifeline activity state 
      setFiftyFiftyActive(false);
      setAskTheAudienceActive(false);
      setPapSuggestedAnswer(null);

    } else { // user wins 
      setAllQuestionsAnswered(true);
      setGameOver(true);
    }
  };

  const lifelineSetters = {
    disableFiftyFifty: () => {
      setLifelinesRemaining((lifelinesRemaining) => ({
        ...lifelinesRemaining,
        fiftyFifty: false,
      }));
    },
    disablePhoneAFriend: () => {
      setLifelinesRemaining((lifelinesRemaining) => ({
        ...lifelinesRemaining,
        phoneAFriend: false,
      }));
    },
    disableAskTheAudience: () => {
      setLifelinesRemaining((lifelinesRemaining) => ({
        ...lifelinesRemaining,
        askTheAudience: false,
      }));
    },
  };

  const lifelineFunctions = {
    fiftyFifty: () => {
      console.log("Fifty-Fifty Activated");
      setFiftyFiftyActive(true);  // disables two random incorrect answers
      lifelineSetters.disableFiftyFifty();
    },

    phoneAFriend: () => {
      console.log("Phone-a-Friend Activated");
      console.log("Fifty-fifty active?: " + fiftyFiftyActive);

      let confidence = 0; // Determines printed comment accompanying answer suggestion

      if (fiftyFiftyActive) { // greater success chance
        const successChance = { // percentage chance to guess correct answer
          easy: 0.9,
          medium: 0.75,
          hard: 0.65,
        };

        confidence = successChance[curQuestion.difficulty];

        // roll random number and use q difficulty to see if the correct answer will be suggested
        const n = Math.random();

        if (n <= successChance[curQuestion.difficulty]) { // success
          setPapSuggestedAnswer(curQuestion.correctAnswer);
        } else {  // failure; suggest remaining enabled incorrect answer
          // get the index of the still-enabled incorrect answer
          const correctAnswerIndex = answers.indexOf(curQuestion.correctAnswer);
          let suggestedAnswerIndex = -1;
          for (let i = 0; i < answers.length; i++) {
            if (
              i != curQuestion.correctAnswerIndex &&
              disabledAnswersIndices.indexOf(i) === -1
            )
              suggestedAnswerIndex = i;
            break;
          }
          if (suggestedAnswerIndex === -1) console.log("Something went wrong");
          else {
            setPapSuggestedAnswer(answers[suggestedAnswerIndex]);
          }
        }
      } else { // fifty-fifty not active

        const successChance = { // lower chance but always higher than pure guess (otherwise lifeline unhelpful)
          easy: 0.85,
          medium: 0.65,
          hard: 0.35,
        };

        confidence = successChance[curQuestion.difficulty];

        // now roll a random number and use the question difficulty success chance to determine whether the friend will suggest the correct answer

        const n = Math.random();

        if (n <= successChance[curQuestion.difficulty]) {
          setPapSuggestedAnswer(curQuestion.correctAnswer);
        } else {
          // pull one of the incorrect answers at random
          const index = Math.floor(Math.random() * 3);
          setPapSuggestedAnswer(curQuestion.incorrectAnswers[index]);
        }
      }

      // add the comment to be displayed alongside answer suggestion
      setPapComment(getPapComment(confidence));

      lifelineSetters.disablePhoneAFriend();
    },

    askTheAudience: () => {
      console.log("Ask-the-Audience Activated");

      setAskTheAudienceActive(true);

      // generate bar-chart heights
      const answerPercentages = generateAskTheAudiencePercentages(
        fiftyFiftyActive,
        curQuestion.difficulty
      );


      const correctAnswerIndex = answers.indexOf(curQuestion.correctAnswer);

      // reorder the heights received based on their corresponding position in the displayed answer buttons
      let orderedAnswerPercentages = [
        ...answerPercentages.wrongAnswerPercentages,
      ];
      orderedAnswerPercentages.splice(
        correctAnswerIndex,
        0,
        answerPercentages.correctAnswerPercentage
      );

      setAskTheAudienceHeights(orderedAnswerPercentages);

      lifelineSetters.disableAskTheAudience();
    },
  };

  const getPapComment = (confidence) => {

    const confidenceComments = {
      low: [
        "I really haven't a clue... Maybe ",
        "Honestly, it's a stab in the dark, but try ",
        "I don't know, but I'd guess ",
      ],
      medium: [
        "I have a suspicion the answer is ",
        "I'm fairly confident it's ",
        "Hmm ... that's a tough one, but try ",
      ],
      high: [
        "It's almost certainly ",
        "I'm confident the answer is ",
        "I think I know this one! ",
      ],
    };

    const numOptions = 3;
    const index = Math.floor(Math.random() * numOptions);

    // pull a random comment based on the confidence level of the friend
    if (confidence <= 1 && confidence >= 0.7) {
      console.log("High");
      return confidenceComments.high[index];
    } else if (confidence >= 0.4) {
      console.log("Medium");
      return confidenceComments.medium[index];
    } else if (confidence >= 0) {
      console.log("Low");
      return confidenceComments.low[index];
    }

    return null;
  };

  // win amount on generic loss, nearest safe amount before curQuestion value
  const getNearestSafetyNetAmount = (curQuestionIndex, safeIndices, prizeMoneyIncrements) => {
    
    let targetIndex = -1;

    for (let i=0; i<safeIndices.length; i++) {
      if (safeIndices[i] >= curQuestionIndex) {
        return (targetIndex === -1 ? 0 : prizeMoneyIncrements[targetIndex]);
      }

      targetIndex = safeIndices[i];
    }

    return prizeMoneyIncrements[safeIndices[safeIndices.length - 1]];

  }

  const generateAskTheAudiencePercentages = (
    fiftyFiftyActive,
    questionDifficulty
  ) => {

    // Audience percentage a function of question difficulty & number of possible choices
    if (fiftyFiftyActive) { // biases used to offset result and produce more variability
      const biases = {
        easy: {
          offset: 0.8,
          stdDev: 0.15,
        },
        medium: {
          offset: 0.6,
          stdDev: 0.15,
        },
        hard: {
          offset: 0.5,
          stdDev: 0.1,
        },
      };

      const offset = biases[questionDifficulty].offset;
      const stdDev = biases[questionDifficulty].stdDev;

      const bias = Math.random() * (2 * stdDev) - stdDev;
      const correctAnswerPercentage = offset + bias;
      const incorrectAnswerPercentage = 1 - correctAnswerPercentage;

      return {
        correctAnswerPercentage: correctAnswerPercentage,
        wrongAnswerPercentages: [incorrectAnswerPercentage],
      };
    } else {
      const biases = {
        easy: {
          offset: 0.65,
          stdDev: 0.2,
        },
        medium: {
          offset: 0.5,
          stdDev: 0.2,
        },
        hard: {
          offset: 0.3,
          stdDev: 0.15,
        },
      };

      const offset = biases[questionDifficulty].offset;
      const stdDev = biases[questionDifficulty].stdDev;

      const bias = Math.random() * (2 * stdDev) - stdDev;
      const correctAnswerPercentage = offset + bias;

      let percentageRemaining = 1 - correctAnswerPercentage;
      const wrongAnswer1Percentage = Math.random() * percentageRemaining;
      percentageRemaining -= wrongAnswer1Percentage;
      const wrongAnswer2Percentage = Math.random() * percentageRemaining;
      percentageRemaining -= wrongAnswer2Percentage;
      const wrongAnswer3Percentage = percentageRemaining;

      return {
        correctAnswerPercentage: correctAnswerPercentage,
        wrongAnswerPercentages: [
          wrongAnswer1Percentage,
          wrongAnswer2Percentage,
          wrongAnswer3Percentage,
        ],
      };
    }
  };

  return (
    <>
      {curQuestion ? (
        <div className="App">
          <div className="MainWindow">
            {gameOver ? (
              <GameOverScreen 
                gameOverType={(allQuestionsAnswered ? (GAME_OVER_TYPES.WIN) : (userRetired ? (GAME_OVER_TYPES.RETIRE) : (GAME_OVER_TYPES.LOSE)))} 
                amountWon={(userRetired ? (curQuestionIndex === 0 ? 0 : PRIZE_MONEY_INCREMENTS[curQuestionIndex-1]) : getNearestSafetyNetAmount(curQuestionIndex, SAFE_INDICES, PRIZE_MONEY_INCREMENTS))}  
                gameOverTypes={GAME_OVER_TYPES}
                reload={reload}
                correctAnswer={curQuestion.correctAnswer}
              />
            ) : (
              <>
                <PortraitWindow
                  className="PortraitWindow"
                  imagePath={"./images/image1.jpg"}
                  lastCorrectAnswer={lastCorrectAnswer}
                  answeredCorrectly={curQuestionIndex !== 0 && !gameOver}
                  papSuggestedAnswer={papSuggestedAnswer}
                  papComment={papComment}
                  askTheAudienceInfo={{
                    active: askTheAudienceActive,
                    heights: askTheAudienceHeights,
                  }}
                  fiftyFiftyActive={fiftyFiftyActive}
                />
                <QuestionDisplay
                  className="QuestionDisplay"
                  question={curQuestion.questionText}
                  correctAnswer={curQuestion.correctAnswer}
                  difficulty={curQuestion.difficulty}
                  handleSelection={handleSelection}
                  answerButtonsDisabled={answerButtonsDisabled}
                  answers={answers}
                  disabledAnswersIndices={disabledAnswersIndices}
                  fiftyFiftyActive={fiftyFiftyActive}
                />
              </>
            )}
          </div>
          <div className="SideWindow">
            <SidePanel
              prizeAmountsInfo={{
                increments: PRIZE_MONEY_INCREMENTS,
                safeIndices: SAFE_INDICES,
                curQuestionIndex: curQuestionIndex,
                numQs: NUM_QS,
              }}
              lifelinesInfo={{
                lifelineFunctions: lifelineFunctions,
                lifelinesRemaining: lifelinesRemaining,
              }}
              userRetire={userRetire}
              disabled={gameOver}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// check if all the API calls have returned
const doneLoadingQuestions = (loadingStates) => {
  for (let difficulty in loadingStates) {
    if (loadingStates[difficulty]) return false;
  }

  return true;
};

const generateApiQueries = (request) => {
  // request an object of the form {easy: n1, medium: n2, hard: n3}
  // returns an array of objects containing the query strings for each set of questions at the given difficulty levels
  if (typeof request === "object") {
    const queries = [];

    Object.keys(request).forEach(function (key) {
      const difficulty = key;
      const amount = request[key];

      const query = `${BASE_API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`;
      queries.push(query);
    });

    return queries;
  } else console.log(typeof request);
};

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

// used to randomise order answers appear (otherwise correct answer always first)
const computeRandomOrder = (length) => {
  let orderArr = new Array(length);
  for (let i = 0; i < orderArr.length; i++) {
    orderArr[i] = i;
  }

  orderArr.sort(() => Math.random() - 0.5);
  return orderArr;
};

// used to the answers according to the indexing array produced by the above function
const reorderAnswers = (indexingArray, question) => {
  let ans = [];

  for (let i = 0; i < indexingArray.length; i++) {
    ans.push(
      [question.correctAnswer, ...question.incorrectAnswers][indexingArray[i]]
    );
  }

  return ans;
};

// returns the indices of the answers to disable if 50:50 is activated
const generateDisabledAnswersIndices = (answers, q) => {
  console.log("From generate... : \n" + q);
  // Just disable the first two answers in the incorrectAnswers prop (they'll be in a random spot in answers)
  let indices = [];
  let incorrectRandomised = q.incorrectAnswers
    .slice()
    .sort(() => 0.5 - Math.random());
  indices.push(answers.indexOf(incorrectRandomised[0]));
  indices.push(answers.indexOf(incorrectRandomised[1]));

  return indices;
};

export default App;
