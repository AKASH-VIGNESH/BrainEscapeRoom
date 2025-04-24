import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/main/Mainer'; // Ensure this file exists
import Mathler from './components/mathler/Mathler';
import Wordle from './components/Wordle/Wordle';
import QuizApp from './components/tieBreaker/QuizApp';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mathler" element={<Mathler />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path='/tie' element={<QuizApp/>}/>
      </Routes>
    </div>
  );
}

export default App;
