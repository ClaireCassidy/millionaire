import React from 'react'
import './AnswerButton.css'

export default function AnswerButton({answer, isCorrect, selectAnswer, disabled}) {
    return (
    	<div className="AnswerButtonContainer">
            <button className={"AnsButton "+(isCorrect ? "_DebugCorrect" : "")} onClick={() => {selectAnswer(isCorrect)}} disabled={disabled}>{answer}</button>
        </div>
    )
}
