import { useState, useEffect } from 'react'

export default function Home() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:3000/api/hello')
            const json = await result.json()
            setData(json)
            console.log(json)
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1 className="text-lg p-5">Krash</h1>
            <button>PLAY</button>
            <p>{data.message}</p>
        </div>
    )
}
