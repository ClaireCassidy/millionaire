import React from 'react'

export default function AnswerButton({answer, isCorrect, selectAnswer, disabled}) {
    return (
    	<div>
            {isCorrect && <button onClick={() => {selectAnswer(true)}} disabled={disabled}><b>{answer}</b></button>}
            {!isCorrect && <button onClick={() => {selectAnswer(false)}} disabled={disabled}><>{answer}</></button>}
        </div>
    )
}
