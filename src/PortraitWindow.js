import React from 'react'
import './PortraitWindow.css'
import image from './images/image1.jpg'

export default function PortraitWindow({imagePath, lastCorrectAnswer}) {

    const styles = {
        backgroundImage: `url(${image})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat"
    }

    //let image = "image1.jpg"

    return (
        <div className="Container" style={styles}>
            {/* {imagePath && <img className="PortraitWindowImage" src={require("./images/image1.jpg")} alt="User Portrait"/>} */}
            <p className="PortraitWindowText">{lastCorrectAnswer ? lastCorrectAnswer : "(Nothing)"}</p>
        </div>
    )
}
