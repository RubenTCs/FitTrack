import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [user, setUsers] = useState([])
    const [email, setEmail] = useState('')
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
            //console.log(res.data)
        })
    }

    const handleRegister = (event) => {
        event.preventDefault();
        axios
        .post('http://localhost:3000/register', { email, username, password })
        .then(() => {
            alert('Registration Successful')
            setEmail('')
            setUsername('')
            setPassword('')
            fetchUsers()
            navigate('/login')
        })
        .catch((error) => {
            console.log('Unable to register user')
        })
    }



  return (
    <div className='w-full h-screen flex flex-col'>
    <div className='flex-grow bg-[#1a1a1a] text-white flex flex-col justify-center items-center'>
        <h2 className='text-3xl text-white mb-8'>SIGNUP</h2>
        <form className='text-center border rounded-lg w-[600px] h-[400px] p-9'>
            {/* Email Input */}
            <div className="mb-4">
                <label>Email</label>
                <br />
                <input className='w-[400px] h-[40px] rounded-xl bg-zinc-700 p-2'
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
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
            <button className='w-[200px] h-[50px] border hover:bg-teal-900' type='submit'>Sign Up</button>
        </form>
    </div>
</div>
  )
}

export default SignUp