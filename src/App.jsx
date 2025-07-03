import './App.scss';
import Map from './components/map/map'
import ControlBar from './components/control-bar/control-bar';
import { useState } from 'react';

function App() {

  const [pointsArray, setPointArray] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(undefined);
  const [clickCoordinates, setClickCoordinates] = useState(undefined);
  const [selectedPointMarker, setSelectedPointMarker] = useState(undefined);
  const [displayedMenus, setDisplayedMenus] = useState([]);

  const markerAndIcons = {
    markerColors: ['red', 'blue', 'yellow', 'green'],
    iconTypes: ['skull', 'chest', 'sword'],
  };

  return (
    <div className="App">
      <header className="App-header">
        <Map pointsArray={pointsArray} setSelectedPoint={setSelectedPoint} setClickCoordinates={setClickCoordinates} markerAndIcons={markerAndIcons} selectedPoint={selectedPoint} clickCoordinates={clickCoordinates} selectedPointMarker={selectedPointMarker} setSelectedPointMarker={setSelectedPointMarker} ></Map>
        <div className='gradient-witchcraft'></div>
        <div className='permanent-top-bar' />
        <ControlBar pointsArray={pointsArray} setPointsArray={setPointArray} clickCoordinates={clickCoordinates} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} markerAndIcons={markerAndIcons} setClickCoordinates={setClickCoordinates} displayedMenus={displayedMenus} setDisplayedMenus={setDisplayedMenus} ></ControlBar>
        <div className='corner bottom-right' />
        <div className='corner top-right' />
        <div className='corner top-left' />
      </header>
    </div>
  );
}

export default App;
