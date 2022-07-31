import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import "./style.css"
import Confetti from "react-confetti"
import useWindowSize from 'react-use/lib/useWindowSize'

export default function App() {

    const [ran, setRan] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const { width, height } = useWindowSize()
    const [counter, setCounter] = React.useState(-1)

    React.useEffect(() => {
        setCounter(counter + 1)
    }, [ran])


    React.useEffect(() => {

        // const allHeld = ran.every(die => die.isHeld)
        // const firstValue = ran[0].value
        // const allSameValue = ran.every(die =>die.value === firstValue)
        // if (allHeld && allSameValue) {
        //     setTenzies(true)
        //     console.log("You won!")
        // }

        const a = ran[0].value;
        let c = 0;
        for (let i = 0; i < 10; i++) {
            if (ran[i].isHeld && ran[i].value === a) c++
        }
        if (c === 10) {
            return setTenzies(true)
        }
        return;
    }, [ran])

    function allNewDice() {
        const ran = []
        for (let i = 0; i < 10; i++) {
            ran[i] = {
                value: Math.floor((Math.random() * 10) % 10),
                isHeld: false,
                id: nanoid()
            }
        }
        return ran;

    }

    function holdDice(id) {
        setRan(oldDice => oldDice.map(die => {
            setCounter(counter - 1)

            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }
        )
        )
    }

    function rollDice() {
        if (!tenzies) {
            setRan(old => old.map(die => {
                if (!die.isHeld) {
                    return { ...die, value: Math.floor((Math.random() * 10) % 10) }
                } else {
                    return die
                }
            }))
        } else {
            setCounter(-1)
            setTenzies(false)
            setRan(allNewDice)
        }

    }

    const allDies = ran.map(die => < Die
        holdDice={() => holdDice(die.id)}
        isHeld={die.isHeld}
        key={die.id}
        value={die.value}
    />)


    return (
        <main>
            {tenzies && <Confetti
                width={width}
                height={height}
                drawShape={ctx => {
                    ctx.beginPath()
                    for (let i = 0; i < 22; i++) {
                        const angle = 0.35 * i
                        const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                        const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                        ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.closePath()
                }}
            />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <p className="counter">{counter}</p>
            <div className="dice-container">
                {allDies}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </main>
    )
}


