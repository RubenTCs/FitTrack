import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const isUserSignedIn = !!localStorage.getItem('token')
    const navigate = useNavigate();


    const handleSignOut = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }


  return (
    <nav className='flex justify-between p-3 border-b border-zinc-800 items-center bg-[#1a1a1a]/90 text-zinc-300'>
        <div className="flex items-center">
            <Link to='/' className="ml-4"><h1 className='text-3xl'>Fitness Tracker</h1></Link>
            <div className="ml-auto flex gap-6">
                <Link to='/routine' className="ml-4">Routine</Link>
                <Link to='/about' className="ml-4">About</Link>
            </div>
        </div>
        <ul className='flex gap-6'>
            { isUserSignedIn ? (
                <>
                <Link to='/account'><li>Account</li></Link>
                <li><button onClick={handleSignOut}>Sign Out</button></li>
                </>
            ) : (
                <>
                <Link to='/login'><li>Login</li></Link>
                <Link to='/signup'><li>SignUp</li></Link>
                </>
            ) }
            
        </ul>
    </nav>
  )
}

export default Navbar
