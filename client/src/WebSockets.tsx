import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

interface IMessage {
    id: number;
    event: string;
    username: string;
    message: string;
}

export default function WebSockets() {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState('')
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')

    const socket = useRef<WebSocket>()




    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current?.send(JSON.stringify(message))
            console.log('Подключение установленно')
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {

        }
        socket.current.onerror = () => {
            console.log("Socket closed")
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current?.send(JSON.stringify(message))
        setValue('')

    }


    if (!connected) {
        return (
            <div>
                <div>
                    <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='Enter your name' />
                    <button onClick={connect}>Login</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {
                        messages.map(mess =>
                            <div className="message" key={mess.id}>
                                {mess.event === 'connection'
                                    ? <div>Пользователь {mess.username} подключился</div>
                                    : <div>{mess.username}. {mess.message}</div>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
