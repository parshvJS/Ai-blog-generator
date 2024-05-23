import React from 'react'
import { Outlet } from 'react-router-dom'

const Root_layout = () => {
    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <header className="bg-blue-700 text-white w-full p-4 text-center">
                <h1 className="text-3xl font-bold">Automated Blog Generator</h1>
            </header>
            
            <Outlet />
           

            <footer className="bg-blue-700 text-white w-full p-4 text-center">
                <p>&copy; 2024 Automated Blog Generator. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Root_layout