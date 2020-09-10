
# millionaire
"Who Wants to be a Millionaire" clone in React.js https://clairecassidy.github.io/millionaire/

# Motivation:
To practise building a webapp using vanilla React, in particular managing state data flow through components via props. The app required management of game state in a centralised App component, hoisting state data derived from UI events in child components and passing this information to parallel child components via props.

# Features:
- The App seeks to emulate the popular TV show "Who Wants to be a Millionaire" by presenting the user with 10 trivia questions of increasing difficulty. The more questions the user answers correctly, the greater the cash prize they win. The questions are fetched from the Open Trivia DB: https://opentdb.com/
- The game emulates the same three single-use lifelines that feature in the TV show - "Phone a Friend", "Ask the Audience", and "Fifty-Fifty" - to aid the user in answering difficult questions. Internally, the success rates of these lifelines are dynamic and dependent on the question difficulty. Visual ques are given to the user about the trustworthiness of the suggestion; for example, when phoning a friend, the friend will give and indication of his/her confidence along with the suggested answer.
- There are three 'game over' states: Victory (the user answers all 10 questions), Game Over (the user answers a question incorrectly and leaves with the most recent 'safety net cash prize' they achieved, indicated in yellow), and Leave (the user leaves with the cash they have earned thus far)

# Technologies:
- React (Front end design & state management)
- Axios (Issuing API requests)
- Asesprite (pixel art)

Written in HTML, CSS, and JSX
