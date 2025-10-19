"use client";
import HomePageArrow from "./homepagearrow";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Communication() {
    useEffect(() => {
        fetch('/api/socket');
        socket = io();

        socket.on("connect", () => {
            console.log("Connected to server");
        });
    }, []);
    
    return (
        <div>
            

            <HomePageArrow></HomePageArrow>
        </div>
    );
}