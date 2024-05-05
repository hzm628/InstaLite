import React from 'react';
import { useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from '../../config.json';
import Navbar from '../components/Navigation';

const MessageComponent = ({ sender, message }: { sender: string, message: string }) => {
    return (
        <div className={`w-full flex ${sender === 'user' && 'justify-end'}`}>
            <div className={`text-left max-w-[70%] p-3 rounded-md break-words ${sender === 'user' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                {message}
            </div>
        </div>
    )
}

export default function ChatInterface() {
    const [messages, setMessages] = useState([{ sender: 'chatbot', message: 'Hi there! What movie review questions do you have?' }]);
    const [input, setInput] = useState<string>('');
    const { username } = useParams();
    const navigate = useNavigate();

    const feed = () => {
        navigate('/home');
    };
    const friends = () => {
        navigate("/friends");
    };

    const sendMessage = async () => {
        // TODO: add the user's message to the messages state 
        if (input.trim()) {
            setMessages(prevMessages => [...prevMessages, { sender: 'user', message: input.trim() }])

            try {
                // TODO: make a call to the getMovies route 
                const response = await axios.get(`${config.serverRootURL}/${username}/movies?query=${encodeURIComponent(input.trim())}`);
                const botMessage = response.data.message || "I'm not sure how to respond to that.";
                setMessages(prevMessages => [...prevMessages, { sender: 'chatbot', message: botMessage }]);
            } catch (error) {
                console.error(error);
                alert("Failed to get a response from the chatbot");
                // TODO: add the chatbot's response to the messages state
                setMessages(prevMessages => [...prevMessages, { sender: 'chatbot', message: "Sorry, I couldn't fetch the movie data." }]);

            }
        }
        setInput('');
    }

    return (
        <div className='w-screen h-screen flex flex-col items-center'>
            <Navbar username={username}></Navbar>
            <div className='font-bold text-3xl'>Internet Movie DB Chat</div>
            <div className='h-[40rem] w-[30rem] bg-slate-100 p-3'>
                <div className='h-[90%] overflow-scroll'>
                    <div className='space-y-2'>
                        {messages.map(msg => {
                            return (
                                <MessageComponent sender={msg.sender} message={msg.message} />
                            )
                        })}
                    </div>
                </div>
                <div className='w-full flex space-x-2'>
                    <input className='w-full outline-none border-none px-3 py-1 rounded-md'
                        placeholder='Ask something!'
                        onChange={e => setInput(e.target.value)}
                        value={input}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                sendMessage();
                                setInput('');
                            }
                        }} />
                    <button className='outline-none px-3 py-1 rounded-md text-bold bg-indigo-600 text-white'
                        onClick={() => {
                            sendMessage();
                        }}>Send</button>
                </div>
            </div>
        </div>
    )
}