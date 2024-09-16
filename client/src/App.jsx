import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddEdit from './AddEdit';



function App() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/edit/:id' element={<AddEdit/>} />
        <Route path='/add' element={<AddEdit/>} />

      </Routes>
    
    </div>
  );
}

export default App;
