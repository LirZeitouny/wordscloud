import React, { useRef, useState } from 'react';
import './App.css';
import generateWordsCloud from './generateWordsCloud';

function App() {
  const [query, setQuery] = useState('Elon Musk');
  const wordsCloudRef = useRef<HTMLDivElement>(null)
  return (
    <div>
      <header>
        <input value={query} onInput={event => setQuery(event.currentTarget.value)} />
        <button
          onClick={() => generateWordsCloud(query, wordsCloudRef.current!)}
        >
          generate
        </button>
        <div ref={wordsCloudRef} className='wordscloud' />
      </header>
    </div>
  );
}

export default App;
