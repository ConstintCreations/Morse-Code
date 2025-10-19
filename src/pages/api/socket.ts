import { Server } from "socket.io";

interface User {
    id: string;
    name: string;
    text: string;
    active: boolean;
}

const users: User[] = [];

export default function SocketHandler(request: any, response: any) {

    function getUserName() {
        const usedNumbers: number[] = [];
        for (const user of users) {
            const match = user.name.match(/^User (\d+)$/);
            if (match) {
                const number = parseInt(match[1], 10);
                usedNumbers.push(number);
            }
        }

        let i = 0;
        while (usedNumbers.includes(i)) {
            i++;
        }
        
        return `User ${i}`;
    }

    if (response.socket.server.io) {
        response.end();
        return;
    }

    const io = new Server(response.socket.server);
    response.socket.server.io = io;

    io.on("connection", (socket) => {
        const newUser: User = { id: socket.id, name: getUserName(), text: '', active: false };
        users.push(newUser);
        io.emit("users-update", users);
        socket.emit("name", newUser.name);

        socket.on("pressed", (pressed: boolean) => {
            const user = users.find((u) => u.id === socket.id);
            if (user) {
                user.active = pressed;
                io.emit("users-update", users);
            }
        });

        socket.on("translate", (text: string) => {
            const user = users.find((u) => u.id === socket.id);
            if (user) {
                user.text = text;
                io.emit("users-update", users);
            }
        });

        socket.on("disconnect", () => {
            const index = users.findIndex((u) => u.id === socket.id);
            if (index !== -1) {
                users.splice(index, 1);
                io.emit("users-update", users);
            }
        });

    });

    response.end();
}