import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();


    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = () => {
        axios
        .get('http://localhost:3000/register')
        .then((res) => {
            console.log(res.data)
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/login', { username, password })
            const token = response.data.token
            alert('Login successful')
            setUsername('')
            setPassword('')
            fetchUsers();
            navigate('/account')
            window.location.reload()
            localStorage.setItem('token', token)
        }catch(error){
            console.log('Login Error')
        }
    }


  return (
    <div className='w-full h-screen flex'>
    <div className='w-[100%] h-[100%] bg-[#1a1a1a] text-white flex flex-col justify-center items-center'>
        <h2 className='text-3xl text-white mb-8'>LOGIN</h2>
        <form className='text-center border rounded-lg w-[600px] h-[300px] p-9' onSubmit={handleLogin}>
            {/* Username Input */}
            <div className="mb-4">
                <label>Username</label>
                <br />
                <input className='w-[400px] h-[40px] rounded-xl bg-zinc-700 p-2'
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            {/* Password Input */}
            <div className="mb-4">
                <label>Password</label>
                <br />
                <input className='w-[400px] h-[40px] rounded-xl bg-zinc-700 p-2'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {/* Button */}
            <button className='w-[200px] h-[50px] border hover:bg-teal-900' type='submit'>Login</button>
        </form>
    </div>
</div>


  )
}

export default Login