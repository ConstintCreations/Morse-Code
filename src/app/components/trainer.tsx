"use client";
import { useState, useRef, useEffect, use } from "react";
import { Goldman } from "next/font/google";

const goldman = Goldman({ 
    subsets: ['latin'], 
    weight: '400'
});

export default function Trainer() {

    const characters = {
        "letters": {
            "A": "•—",
            "B": "—•••",
            "C": "—•—•",
            "D": "—••",
            "E": "•",
            "F": "••—•",
            "G": "——•",
            "H": "••••",
            "I": "••",
            "J": "•———",
            "K": "—•—",
            "L": "•—••",
            "M": "——",
            "N": "—•",
            "O": "———",
            "P": "•——•",
            "Q": "——•—",
            "R": "•—•",
            "S": "•••",
            "T": "—",
            "U": "••—",
            "V": "•••—",
            "W": "•——",
            "X": "—••—",
            "Y": "—•——",
            "Z": "——••"
        },
        "numbers": {
            "0": "—————",
            "1": "•————",
            "2": "••———",
            "3": "•••——",
            "4": "••••—",
            "5": "•••••",
            "6": "—••••",
            "7": "——•••",
            "8": "———••",
            "9": "————•",
        },
        "symbols": {
            ".": "•—•—•—",
            ",": "——••——",
            "?": "••——••",
            "'": "•————•",
            "!": "—•—•——",
            "/": "—••—•",
            "(": "—•——•",
            ")": "—•——•—",
            "&": "•—•••",
            ":": "———•••",
            ";": "—•—•—•",
            "=": "—•••—",
            "+": "•—•—•",
            "-": "—••••—",
            "_": "••——•—",
            "\"": "•—••—•",
            "$": "•••—••—",
            "@": "•——•—•"
        }
    }

    const [submittableStyle, setSubmittableStyle] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [gamePlaying, setGamePlaying] = useState(false);
    const [input, setInput] = useState<string>("");
    const [character, setCharacter] = useState<string>("");
    const [availableCharacters, setAvailableCharacters] = useState<string[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const lastPressTime = useRef<number>(0);

    const [lettersPressed, setLettersPressed] = useState(true);
    const [numbersPressed, setNumbersPressed] = useState(false);
    const [symbolsPressed, setSymbolsPressed] = useState(false);

    const [learnMode, setLearnMode] = useState(false);
    const [practiceMode, setPracticeMode] = useState(false);

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

                if (gamePlaying) {
                    if (pressDuration < 250 && input.length < 7) {
                        setInput(input + '•');
                    } else if (pressDuration < 750  && input.length < 7) {
                        setInput(input + '—');
                    } else {
                        setInput('');
                    }
                }
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }
        }
    }

    useEffect(() => {
        if (input.length > 0) {
            setSubmittableStyle(true);
        } else {
            setSubmittableStyle(false);
        }
    }, [input]);

    function modePress(learnModePressed: boolean) {
        if (lettersPressed || numbersPressed || symbolsPressed) {
            if (learnModePressed) {
                setLearnMode(true);
                setPracticeMode(false);
                startGame();
            } else {
                setLearnMode(false);
                setPracticeMode(true);
                startGame();
            }
        } else  {
            alert("Please select at least one character set (Letters, Numbers, Symbols) before choosing a mode.");
        }
    }

    function startGame() {
        setGamePlaying(true);
        let chars: string[] = [];
        if (lettersPressed) {
            chars = chars.concat(Object.keys(characters.letters));
        }
        if (numbersPressed) {
            chars = chars.concat(Object.keys(characters.numbers));
        }
        if (symbolsPressed) {
            chars = chars.concat(Object.keys(characters.symbols));
        }
        chars.sort(() => Math.random() - 0.5);
        setAvailableCharacters(chars);
    }

    function submitInput() {
        setInput('');
        setAvailableCharacters(availableCharacters.slice(1));
    }

    useEffect(() => {
        if (gamePlaying) {
            if (availableCharacters.length > 0) {
                setCharacter(availableCharacters[0]);
                console.log("Next character:", availableCharacters[0]);
            } else {
                setGamePlaying(false);
                endGame();
            }
        }
    }, [availableCharacters]);

    function endGame() {
        setCharacter("");
        setAvailableCharacters(prev => (prev.length === 0 ? prev : []));
    }

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setInput(
                    prev => {
                        submitInput();
                        return prev;
                    }
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [submitInput]);

    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-10 mt-20">
                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="flex flex-row justify-center items-center gap-5">
                        <button onMouseDown={() => setLettersPressed(!lettersPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${lettersPressed ? "bg-yellow-600" : "hover:bg-yellow-600/50"}`}>Letters</button>
                        <button onMouseDown={() => setNumbersPressed(!numbersPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${numbersPressed ? "bg-blue-600" : "hover:bg-blue-600/50"}`}>Numbers</button>
                        <button onMouseDown={() => setSymbolsPressed(!symbolsPressed)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${symbolsPressed ? "bg-pink-600" : "hover:bg-pink-600/50"}`}>Symbols</button>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-5">
                        <button onMouseDown={() => modePress(true)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${learnMode ? "underline" : ""}`}>Learn</button>
                        <button onMouseDown={() => modePress(false)} className={`text-2xl font-bold cursor-pointer p-2 rounded-lg transition-all duration-300 ease-in-out ${practiceMode ? "underline" : ""}`}>Practice</button>
                    </div>
                </div>
                

                <div className="flex flex-col justify-center items-center gap-5 mb-5">

                    <div className="flex flex-column items-center justify-center p-5 text-8xl font-mono border-4 border-gray-600 rounded-lg h-40 w-40 text-center">
                        {character}
                    </div>

                    <div className={`${goldman.className} flex flex-column items-center justify-center p-5 text-4xl font-mono border-4 border-gray-600 rounded-lg h-25 min-w-[300px] text-center`}>
                        {input}
                    </div>

                    <button onMouseDown={() => submitInput()} className={`cursor-pointer text-lg font-bold p-1 pl-6 pr-6 rounded-lg transition-colors duration-300 ease-in-out ${submittableStyle ? "bg-blue-700 text-gray-200" : "bg-gray-800 text-gray-400"}`}>
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