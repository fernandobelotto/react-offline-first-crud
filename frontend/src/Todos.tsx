import axios from "axios"
import { useEffect, useRef, useState } from "react"
import Cloud from "./icons/cloud"
import CloudFailed from "./icons/cloud-failed"
import CloudOffline from "./icons/cloud-offline"
import Spinner from "./icons/spinner"
import { useOnline } from "./useOnline"
import { v4 as uuidv4 } from 'uuid';


const TODOS = 'todos'
const QUEUE = 'queue'

const CREATE = 'create'
const DELETE = 'delete'
const UPDATE = 'update'

const url = 'http://localhost:3000/'

const icons: any = {
    'synchronizing': <Spinner />,
    'offline': <CloudOffline />,
    'synced': <Cloud />,
    'failed': <CloudFailed />,
}

export default function Todos() {


    const inputRef = useRef<any>()
    const [todos, setTodos] = useState<any>(() => {
        if (localStorage.getItem(TODOS)) {
            return JSON.parse(localStorage.getItem(TODOS) as string)
        }
        return []
    })

    const [queue, setQueue] = useState<any>(() => {
        if (localStorage.getItem(QUEUE)) {
            return JSON.parse(localStorage.getItem(QUEUE) as string)
        }
        return []
    })

    const [syncState, setSyncState] = useState<
        'synchronizing' | 'idle' | 'failed' | 'synced' | 'offline'
    >('idle')

    const isOnline = useOnline()

    useEffect(() => {
        localStorage.setItem(TODOS, JSON.stringify(todos))
    }, [todos])

    const sync = async () => {
        if (!isOnline) {
            return setSyncState('offline')
        }
        setSyncState('synchronizing')
        try {
            processQueue()
        } catch (e) {
            return setSyncState('failed')
        }
        setSyncState('synced')
    }

    // sync in network change
    useEffect(() => {
        if (!isOnline) {
            setSyncState('offline')
        } else {
            sync()
        }
    }, [isOnline])


    // sync in startup
    useEffect(() => {
        sync()
    }, [])

    const handleNewTodo = () => {
        if (inputRef.current.value) {
            const newTodo = { content: inputRef.current.value, id: uuidv4() }
            addToQueue({ type: CREATE, payload: newTodo })
            sync()
            setTodos([...todos, newTodo])
        }
    }

    const handleDeleteTodo = (id: string) => {
        const newTodos = todos.filter((item: any) => item.id != id)
        addToQueue({ type: DELETE, payload: { id } })
        setTodos([...newTodos])
        sync()
    }

    const addToQueue = (item: { type: string; payload: any }): void => {
        if (localStorage.getItem(QUEUE)) {
            const queue: any[] = JSON.parse(localStorage.getItem(QUEUE) as string)
            queue.push(item)
            localStorage.setItem(QUEUE, JSON.stringify(queue))
        } else {
            localStorage.setItem(QUEUE, JSON.stringify([item]))
        }
    }

    const removeFromQueue = (id: any): void => {
        if (localStorage.getItem(QUEUE)) {
            const queue: any[] = JSON.parse(localStorage.getItem(QUEUE) as string)
            const filteredQueue = queue.filter((item) => item.payload.id !== id)
            localStorage.setItem(QUEUE, JSON.stringify(filteredQueue))
        } else {
            localStorage.setItem(QUEUE, JSON.stringify([]))
        }
    }

    const processQueue = () => {
        if (localStorage.getItem(QUEUE)) {
            const queue: any[] = JSON.parse(localStorage.getItem(QUEUE) as string)
            for (let item of queue) {
                switch (item.type) {
                    case CREATE:
                        axios.post(url, item.payload)
                        break;
                    case UPDATE:
                        axios.put(url + item.payload.id, item.payload)
                        break;
                    case DELETE:
                        axios.delete(url + item.payload.id)
                        break;
                    default:
                        break;
                }
                removeFromQueue(item.payload.id)
            }
        }
        axios.get(url).then(res => res?.data ? setTodos(res?.data) : null)

    }

    return (
        <>
            <p>{icons[syncState]} {syncState}</p>

            <input ref={inputRef} placeholder='New content here' />
            <button onClick={handleNewTodo}>New Todo</button>
            {todos?.map((todo: any) => {
                return (
                    <>
                        <p>{todo.content}</p>
                        <button onClick={() => handleDeleteTodo(todo.id)}>delete</button>
                    </>
                )
            })}
        </>
    )
}
