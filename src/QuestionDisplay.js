import React from 'react'
import AnswerButton from './AnswerButton'
import { queries } from '@testing-library/react'

export default function QuestionDisplay({question, answers}) {

    // question = string
    // answers = string[]



    return (
        <>
            {/* <div className="question-display">This is the question display</div>
            <div className="answers-display">This is the answer display</div> */}
            <div><p>{question}</p></div>
            <AnswerButton answer={answers[0]}/>
            <AnswerButton answer={answers[1]}/>
            <AnswerButton answer={answers[2]}/>
            <AnswerButton answer={answers[3]}/>
        </>
    )
}
