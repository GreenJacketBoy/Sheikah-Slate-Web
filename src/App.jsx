import './App.scss';
import Map from './components/map/map'
import ControlBar from './components/control-bar/control-bar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Map></Map>
        <ControlBar></ControlBar>
      </header>
    </div>
  );
}

export default App;
