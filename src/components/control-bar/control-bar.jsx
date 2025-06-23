import ActionsMenu from '../actionsMenu/actionsMenu';
import { useRef } from 'react';

export default function ControlBar({ pointsArray, setPointsArray, clickCoordinates }) {

  const controlBar = useRef(null);

  const addPointAtRandom = () => {

    const lat = Math.random() * (50 - 40) + 40;
    const lng = Math.random() * (4 - 3) + 3;

    const newPointsArray = [...pointsArray];

    newPointsArray.push(
      {
        id: `${lat}-${lng}`,
        coordinates: [lng, lat],
      }
    )

    setPointsArray(newPointsArray)
  }

  return (
    <div ref={ controlBar } className='control-bar'>

      <ActionsMenu clickCoordinates={clickCoordinates} pointsArray={pointsArray} setPointsArray={setPointsArray} selectedPoint={undefined} ></ActionsMenu>
      <button onClick={addPointAtRandom}> Add Point</button>

    </div>
  );
}

