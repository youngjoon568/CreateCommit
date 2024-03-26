"use client";

import { Button, Input } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Page: React.FC = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    useEffect(() => {
        socket.on("receive_message", (msg) => {
            setResponse(msg);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = () => {
        socket.emit("send_message", message);        
    };    

    return (
        <div>
            <Input
                value={message}
                placeholder={"gitmoji 커밋 메세지를 만들어 드릴게요"}
                onChange={(e) => {
                    setMessage(e.target.value);                    
                }}
            />
            <Button onClick={sendMessage}>메시지 보내기</Button>
            <p>{response}</p>
        </div>
    );
};

export default Page;