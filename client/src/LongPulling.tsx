import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface IMessage {
    id: number;
    message: string;
}

export default function LongPulling() {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState('')

    const subscribe = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/get-messages')
            setMessages(prev => [data, ...prev])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
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
