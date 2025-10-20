"use client";
import HomePageArrow from "./homepagearrow";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Goldman } from "next/font/google";

const goldman = Goldman({ 
    subsets: ['latin'], 
    weight: '400'
});

let socket: Socket;

export default function Communication() {

    const translations: Record<string, string> = {
        "•—": "A",
        "—•••": "B",
        "—•—•": "C",
        "—••": "D",
        "•": "E",
        "••—•": "F",
        "——•": "G",
        "••••": "H",
        "••": "I",
        "•———": "J",
        "—•—": "K",
        "•—••": "L",
        "——": "M",
        "—•": "N",
        "———": "O",
        "•——•": "P",
        "——•—": "Q",
        "•—•": "R",
        "•••": "S",
        "—": "T",
        "••—": "U",
        "•••—": "V",
        "•——": "W",
        "—••—": "X",
        "—•——": "Y",
        "——••": "Z",
        "—————": "0",
        "•————": "1",
        "••———": "2",
        "•••——": "3",
        "••••—": "4",
        "•••••": "5",
        "—••••": "6",
        "——•••": "7",
        "———••": "8",
        "————•": "9",
        "•—•—•—": ".",
        "——••——": ",",
        "••——••": "?",
        "•————•": "'",
        "—•—•——": "!",
        "—••—•": "/",
        "—•——•": "(",
        "—•——•—": ")",
        "•—•••": "&",
        "———•••": ":",
        "—•—•—•": ";",
        "—•••—": "=",
        "•—•—•": "+",
        "—••••—": "-",
        "••——•—": "_",
        "•—••—•": "\"",
        "•••—••—": "$",
        "•——•—•": "@",
    };

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingText, setLoadingText] = useState<string>("");
    const [pressed, setPressed] = useState(false);
    const [users, setUsers] = useState<Array<{id: string, name:string, text: string, active: boolean}>>([]);
    const [name, setName] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [translated, setTranslated] = useState<string>("");
    const audioRef = useRef<HTMLAudioElement>(null);
    const lastPressTime = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    setTimeout(() => {
        if (loading) {
            setLoadingText("Loading...");
        }
    }, 500);

    useEffect(() => {
        fetch('/api/socket');
        socket = io();

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("users-update", (updatedUsers) => {
            setUsers(updatedUsers);
            if (loading) {
                setLoading(false);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("name", (assignedName: string) => {
            setName(assignedName);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function press(setToPressed: boolean) {
        if (setToPressed) {
            setPressed(true);
            if (audioRef.current) {
                audioRef.current.play();
            }
            socket.emit("pressed", true);
            lastPressTime.current = Date.now();

        } else {
            if (pressed) {
                setPressed(false);
                const pressDuration = Date.now() - lastPressTime.current;
            
                let newDotDash = '';
                if (pressDuration < 220 && input.length < 7) {
                    newDotDash = "•";
                } else if (pressDuration < 640  && input.length < 7) {
                    newDotDash = "—";
                } else {
                    setInput('');
                }

                if (newDotDash) {
                    setInput((prev) => {
                        const updatedInput = prev + newDotDash;
                        setTranslated(translations[updatedInput] || '');

                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        timeoutRef.current = setTimeout(() => {
                            socket.emit("translate", translations[updatedInput] || '');
                            setInput('');
                            setTranslated('');
                            if (clearTimeoutRef.current) {
                                clearTimeout(clearTimeoutRef.current);
                            }
                            clearTimeoutRef.current = setTimeout(() => {
                                socket.emit("translate", '');
                            }, 1500);
                        }, 1000);

                        return updatedInput;
                    });
                }
                
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                socket.emit("pressed", false);
            }
        }
    }
    
    return (
        <div>
            {loading ? (
                <div className="flex flex-col justify-center items-center h-screen text-6xl">
                    {loadingText}
                </div>
            ) : (
            <div>
                <div className="flex flex-row justify-left items-start h-screen gap-5 p-10 pt-25">
                    {
                        users.map((user) => (
                            <div key={user.id} className="flex flex-row justify-between items-center gap-5 p-5 rounded-lg border-5 border-gray-700 bg-gray-800">
                                <div className="flex flex-col justify-center items-center">
                                    <div className={`h-8 w-8 border-6 rounded-full ${user.active ? "border-yellow-700 bg-yellow-600" : "border-gray-700 bg-gray-600"}`}></div>
                                    <h1 className="text-lg">{user.name}</h1>
                                </div>
                                <div className="flex flex-col justify-center items-center border-5 border-gray-600 rounded-lg p-5 w-15 h-15 text-3xl bg-zinc-800">
                                    {user.text || ''}
                                </div>
                            </div>
                        ))
                    }

                </div>

                <div className="fixed bottom-15 left-57.5 w-full flex justify-center items-center">
                    <div className={`${goldman.className} flex flex-col items-center p-5 text-4xl font-mono border-4 border-gray-600 gap-3 rounded-lg min-w-[300px] text-center h-25 justify-center`}>
                            {input}
                        </div>
                </div>

                <div className="fixed bottom-15 right-32.5 w-full flex justify-center items-center">
                    <div className={`flex flex-col items-center p-5 text-7xl font-mono border-4 border-gray-600 gap-3 rounded-lg w-25 text-center h-25 justify-center bg-zinc-900`}>
                            {translated}
                        </div>
                </div>

                <div className="fixed bottom-10 left-0 w-full flex justify-center items-center">
                    <button onMouseDown={() => press(true)} onMouseLeave={() => press(false)} onMouseUp={() => press(false)} className="cursor-pointer flex flex-col justify-end items-center h-35 relative">
                        <div className={`w-20 bg-red-400 relative rounded-br-[50%] rounded-bl-[50%] border-5 border-red-800 z-20 transition-all ${pressed ? "h-10" : "h-15"}`}>
                            <div className={`w-20 h-10 bg-red-400 rounded-[50%] border-5 border-red-800 absolute left-[-5px] transition-all ${pressed ? "top-[calc(-50%-10px)]" : "top-[calc(-33%-8px)]"}`}>
                                
                            </div>
                        </div>
                        <div className="w-25 h-15 top-[-10px] relative z-10 bg-gray-500 border-5 rounded-bl-lg rounded-br-lg border-gray-600 text-center">
                            <div className={`absolute w-25 h-10 bg-gray-400 border-5 border-gray-600 rounded-lg absolute left-[-5px] transition-all top-[calc(-40%-8px)]`}>
                                
                            </div>
                            <div className="mt-5 text-white font-bold">
                                {name}
                            </div>
                        </div>
                    </button>
                </div>
                

                <audio ref={audioRef} src="/beep.mp3" loop></audio>
                <HomePageArrow></HomePageArrow>
            </div>)}
        </div>
    );
}