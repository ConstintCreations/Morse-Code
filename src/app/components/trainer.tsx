"use client";
import { useState, useRef } from "react";

export default function Trainer() {
    const [pressed, setPressed] = useState(false);
    const [input, setInput] = useState<string>("");
    const [character, setCharacter] = useState<string>("A");
    const audioRef = useRef<HTMLAudioElement>(null);
    const lastPressTime = useRef<number>(0);

    const [lettersPressed, setLettersPressed] = useState(true);
    const [numbersPressed, setNumbersPressed] = useState(false);
    const [symbolsPressed, setSymbolsPressed] = useState(false);

    function press(setToPressed: boolean) {
        if (setToPressed) {
            setPressed(true);
            lastPressTime.current = Date.now();
            if (audioRef.current) {
                audioRef.current.play();
            }
        } else {
            if (pressed) {
                setPressed(false);
                const pressDuration = Date.now() - lastPressTime.current;
                if (pressDuration < 250) {
                    console.log("Dot");
                    setInput(input + '•');
                } else if (pressDuration < 750) {
                    console.log("Dash");
                    setInput(input + '—');
                } else {
                    console.log("Too long");
                }
                console.log("Pressed for", pressDuration, "ms");
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }
        }
    }

    document.onkeydown = function(e) {
        if (e.key === 'Enter') {
            console.log("Submitted:", input);
            setInput('');
        }
    };

    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-10 mt-20">
                <div className="flex flex-row justify-center items-center gap-5">
                    <button onMouseDown={() => setLettersPressed(!lettersPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${lettersPressed ? "bg-yellow-600" : "hover:bg-yellow-600/50"}`}>Letters</button>
                    <button onMouseDown={() => setNumbersPressed(!numbersPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${numbersPressed ? "bg-blue-600" : "hover:bg-blue-600/50"}`}>Numbers</button>
                    <button onMouseDown={() => setSymbolsPressed(!symbolsPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${symbolsPressed ? "bg-pink-600" : "hover:bg-pink-600/50"}`}>Symbols</button>
                </div>

                <div className="flex flex-col justify-center items-center gap-5 mb-5">

                    <div className="flex flex-column items-center justify-center p-5 text-9xl font-mono border-4 border-gray-600 rounded-lg min-h-[300px] min-w-[300px] text-center">
                        {character}
                    </div>

                    <div className="flex flex-column items-center justify-center p-5 text-4xl font-mono border-4 border-gray-600 rounded-lg h-25 min-w-[300px] text-center">
                        {input}
                    </div>

                    <button onMouseDown={() => setInput('')} className="cursor-pointer text-lg font-bold bg-gray-800 text-gray-400 p-1 pl-6 pr-6 rounded-lg hover:text-gray-200 hover:bg-blue-800 active:text-gray-200 active:bg-blue-700 transition-colors duration-300 ease-in-out">
                        Submit 
                        <p className="text-sm">(Enter)</p>
                    </button>
                
                </div>

                <div>

                    <button onMouseDown={() => press(true)} onMouseLeave={() => press(false)} onMouseUp={() => press(false)} className="cursor-pointer flex flex-col justify-end items-center h-35 relative">
                        <div className={`w-20 bg-red-400 relative rounded-br-[50%] rounded-bl-[50%] border-5 border-red-800 z-20 transition-all ${pressed ? "h-10" : "h-15"}`}>
                            <div className={`w-20 h-10 bg-red-400 rounded-[50%] border-5 border-red-800 absolute left-[-5px] transition-all ${pressed ? "top-[calc(-50%-10px)]" : "top-[calc(-33%-8px)]"}`}>

                            </div>
                        </div>
                        <div className="w-25 h-15 top-[-10px] relative z-10 bg-gray-500 border-5 rounded-bl-lg rounded-br-lg border-gray-600">
                            <div className={`absolute w-25 h-10 bg-gray-400 border-5 border-gray-600 rounded-lg absolute left-[-5px] transition-all top-[calc(-40%-8px)]`}>

                            </div>
                        </div>
                    </button>

                </div>
            </div>
            <audio ref={audioRef} src="/beep.mp3" loop></audio>
        </div>
    )
}