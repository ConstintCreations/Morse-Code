"use client";
import HomePageArrow from "./homepagearrow";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Communication() {
    const [pressed, setPressed] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    function press(setToPressed: boolean) {
        if (setToPressed) {
            setPressed(true);
            if (audioRef.current) {
                audioRef.current.play();
            }
        } else if (pressed) {
            setPressed(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }

    useEffect(() => {
        fetch('/api/socket');
        socket = io();

        socket.on("connect", () => {
            console.log("Connected to server");
        });
    }, []);
    
    return (
        <div>
            <div className="flex flex-row justify-left items-start h-screen gap-5 p-10 pt-25">

                <div className="flex flex-row justify-between items-center gap-5 p-5 rounded-lg border-5 border-gray-700 bg-gray-800">
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-8 w-8 border-6 rounded-full border-gray-700 bg-gray-600 hover:border-yellow-700 hover:bg-yellow-600"></div>
                        <h1 className="text-lg">User 0</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center border-5 border-gray-600 rounded-lg p-5 w-15 h-15 text-3xl bg-zinc-800">
                        ...
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center gap-5 p-5 rounded-lg border-5 border-gray-700 bg-gray-800">
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-8 w-8 border-6 rounded-full border-gray-700 bg-gray-600 hover:border-yellow-700 hover:bg-yellow-600"></div>
                        <h1 className="text-lg">User 1</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center border-5 border-gray-600 rounded-lg p-5 w-15 h-15 text-3xl bg-zinc-800">
                        ...
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center gap-5 p-5 rounded-lg border-5 border-gray-700 bg-gray-800">
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-8 w-8 border-6 rounded-full border-gray-700 bg-gray-600 hover:border-yellow-700 hover:bg-yellow-600"></div>
                        <h1 className="text-lg">User 2</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center border-5 border-gray-600 rounded-lg p-5 w-15 h-15 text-3xl bg-zinc-800">
                        ...
                    </div>
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
                            User 0
                        </div>
                    </div>
                </button>
            </div>
            

            <audio ref={audioRef} src="/beep.mp3" loop></audio>
            <HomePageArrow></HomePageArrow>
        </div>
    );
}