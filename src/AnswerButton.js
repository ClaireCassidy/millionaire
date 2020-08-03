import React from 'react'

export default function AnswerButton({answer, isCorrect, selectAnswer}) {
    return (
    	<div>
            {isCorrect && <button onClick={() => {selectAnswer(true)}}><b>{answer}</b></button>}
            {!isCorrect && <button onClick={() => {selectAnswer(false)}}><>{answer}</></button>}
        </div>
    )
}
