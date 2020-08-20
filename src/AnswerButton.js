import React from 'react'
import './AnswerButton.css'

export default function AnswerButton({answer, isCorrect, selectAnswer, disabled}) {
    return (
    	<div className="AnswerButtonContainer">
            {isCorrect && <button className="AnsButton" onClick={() => {selectAnswer(true)}} disabled={disabled}><i>{answer}</i></button>}
            {!isCorrect && <button className="AnsButton" onClick={() => {selectAnswer(false)}} disabled={disabled}><>{answer}</></button>}
        </div>
    )
}
