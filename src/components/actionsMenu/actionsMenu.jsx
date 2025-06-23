import { useRef } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function ActionsMenu({ clickCoordinates, pointsArray, setPointsArray, selectedPoint }) {

  const actionsMenu = useRef(null);

  const markerColors = ['red', 'blue', 'yellow', 'green'];
  const iconTypes = []; // TODO : icons in addition to markers

  const onMarkerClicked = (color) => {
    
    if (!selectedPoint && clickCoordinates) { // if no points are selected

      const newPointsArray = [...pointsArray];
      const {lng, lat} = clickCoordinates;

      newPointsArray.push(
        {
          id: `${color}-marker`,
          coordinates: [lng, lat],
        }
      );
      
      setPointsArray(newPointsArray);
      console.log('check');
      
    }
  }

  return (
    <div ref={ actionsMenu } className='actionMenu'>

      {
        markerColors.map((color, index) => (
          <img key={index} src={`/${color}Marker.png`} alt={`${color} marker`} onClick={() => onMarkerClicked(color)} />
        ))
      }

    </div>
  );
}

