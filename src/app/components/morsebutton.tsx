"use client";
import { useState } from "react";

export default function MorseButton() {
    const [pressed, setPressed] = useState(false);

    return (
        <button onMouseDown={() => setPressed(true)} onMouseLeave={() => setPressed(false)} onMouseUp={() => setPressed(false)} className="cursor-pointer flex flex-col justify-end items-center h-35 relative">
            <div className={`w-20 bg-red-400 relative rounded-br-[50%] rounded-bl-[50%] border-5 border-red-800 z-20 transition-all ${pressed ? "h-10" : "h-15"}`}>
                <div className={`w-20 h-10 bg-red-400 rounded-[50%] border-5 border-red-800 absolute left-[-5px] transition-all ${pressed ? "top-[calc(-50%-10px)]" : "top-[calc(-33%-8px)]"}`}>

                </div>
            </div>
            <div className="w-25 h-15 top-[-10px] relative z-10 bg-gray-500 border-5 rounded-bl-lg rounded-br-lg border-gray-600">
                <div className={`absolute w-25 h-10 bg-gray-400 border-5 border-gray-600 rounded-lg absolute left-[-5px] transition-all top-[calc(-40%-8px)]`}>

                </div>
            </div>
        </button>
    )
}