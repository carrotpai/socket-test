import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface IMessage {
    id: number;
    message: string;
}

export default function EventSourcing() {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState('')

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect')
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
    }

    useEffect(() => {
        subscribe()
    }, [])

    const sendMessage = async () => {
        await axios.post("http://localhost:5000/new-messages", {
            message: value,
            id: Date.now()
        })

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
                                {mess.message}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
