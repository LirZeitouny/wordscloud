import React, { useState } from 'react';
import './App.css';
import generateWordsCloud from './generateWordsCloud';

function App() {
  const [query, setQuery] = useState('Elon Mask');

  return (
    <div>
      <header>

        <input defaultValue={'Elon Mask'} title='Put tyour cloud Query' onInput={event => setQuery(event.currentTarget.value)} />
        <button
          onClick={async () => await generateWordsCloud(query)}
        >
          generate words cloud
        </button>
        <div id='wordsclod' className='wordscloud' />
      </header>
    </div>
  );
}

export default App;
