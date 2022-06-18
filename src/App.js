import getFeedback from 'getFeedback';

function App() {
  return (
    <>
      <header>
        <h1>Schrodinger's Mastermind</h1>
      </header>
      <div className="board">
        The actual game should go here.
      </div>
      <footer>
        <p>
          <span>It's a harder version of Mastermind</span>
          <span className="spacer">|</span>
          <a href="https://github.com/bracketdash/mastermind">See it on GitHub</a>
        </p>
      </footer>
    </>
  );
}

export default App;
