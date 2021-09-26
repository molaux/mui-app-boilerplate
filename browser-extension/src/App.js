import './App.css';
import { ReactComponent as MUILogoIcon } from './logo.svg'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MUILogoIcon height="4em" width="4em"/>
        Test
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
