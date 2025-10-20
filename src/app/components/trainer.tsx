"use client";
import { useState, useRef, useEffect } from "react";
import { Goldman } from "next/font/google";

import HomePageArrow from "./homepagearrow";

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

    const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false);

    const [submittableStyle, setSubmittableStyle] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [gamePlaying, setGamePlaying] = useState(false);
    const [input, setInput] = useState<string>("");
    const [character, setCharacter] = useState<string>("");
    const [availableCharacters, setAvailableCharacters] = useState<string[]>([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCharacters, setTotalCharacters] = useState(0);

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
                    if (pressDuration < 220 && input.length < 7) {
                        setInput(input + '•');
                    } else if (pressDuration < 640  && input.length < 7) {
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
        setCorrectCount(0);
        setGamePlaying(true);
        setInput('');
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
        setTotalCharacters(chars.length);
        setAvailableCharacters(chars);
    }

    function submitInput() {
        if (input == characters.letters[character as keyof typeof characters.letters] || input == characters.numbers[character as keyof typeof characters.numbers] || input == characters.symbols[character as keyof typeof characters.symbols]) {
            setCorrectCount(correctCount + 1);
        }
        setInput('');
        setAvailableCharacters(availableCharacters.slice(1));
    }

    useEffect(() => {
        if (gamePlaying) {
            if (availableCharacters.length > 0) {
                setCharacter(availableCharacters[0]);
            } else {
                setGamePlaying(false);
                endGame();
            }
        }
    }, [availableCharacters]);

    function endGame() {
        setCharacter("");
        setAvailableCharacters(prev => (prev.length === 0 ? prev : []));
        setInput(`${correctCount}/${totalCharacters}`);
        setCorrectCount(0);
        setTotalCharacters(0);
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

                    <div className="flex flex-col items-center justify-center p-5 text-8xl font-mono border-4 border-gray-600 rounded-lg h-40 w-40 text-center">
                        {character}
                    </div>

                    <div className={`${goldman.className} flex flex-col items-center p-5 text-4xl font-mono border-4 border-gray-600 gap-3 rounded-lg min-w-[300px] text-center ${learnMode ? "h-30" : "h-25 justify-center"}`}>
                        <div className="text-green-600">{learnMode ? characters.letters[character as keyof typeof characters.letters] || characters.numbers[character as keyof typeof characters.numbers] || characters.symbols[character as keyof typeof characters.symbols] : ""}</div>
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

                <div className={`z-100 fixed top-0 p-5 right-0 w-100 h-full bg-gray-800 border-5 border-gray-600 rounded-tl-lg rounded-bl-lg text-white text-center translate-all duration-300 ease-in-out ${helpMenuOpen ? "right-0" : "right-[-400px]"}`}>
                    <h1 className="text-3xl mb-3">Help</h1>
                    <h1 className="text-2xl mb-3">Character Sets</h1>
                    <p className="mb-2">Choose the character set(s) you want to practice.</p>
                    <h1 className="text-2xl mb-3">Mode</h1>
                    <p className="mb-2 flex flex-col align-items justify-center gap-1">
                        <span><b>Learn</b> - Shows the correct answer.</span>
                        <span><b>Practice</b> - Hides the correct answer to self-test.</span>
                    </p>
                    <h1 className="text-2xl mb-3">Character</h1>
                    <p className="mb-2">This shows the current character to input in Morse code.</p>
                    <h1 className="text-2xl mb-3">Morse Code</h1>
                    <p className="mb-2">This shows the Morse code you input.</p>
                    <h1 className="text-2xl mb-3">Submit</h1>
                    <p className="mb-2">This submits your guess. Your guess can also be submitted with <span className="bg-zinc-900 p-1 rounded-md">Enter</span></p>
                    <h1 className="text-2xl mb-3">Red Button</h1>
                    <p className="mb-2">Press the red button shorter (•) or longer (-) to input Morse code. Hold to clear.</p>
                </div>

                <button onMouseDown={() => setHelpMenuOpen(!helpMenuOpen)} className={`fixed bottom-10 cursor-pointer left-10 flex justify-center items-center rounded-full p-5 border-5 w-10 h-10 text-2xl transition-colors duration-300 ease-in-out ${helpMenuOpen ? "bg-blue-600 border-blue-500" : "bg-gray-600 border-gray-500 hover:bg-blue-600/50 hover:border-blue-500/50"}`}>
                        ?
                </button>
            </div>
            <audio ref={audioRef} src="/beep.mp3" loop></audio>
            <HomePageArrow></HomePageArrow>
        </div>
    )
}