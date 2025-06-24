import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    console.log(selectedPoint);
  }, [selectedPoint])

  const onMarkerClicked = (color) => {
    
    if (!selectedPoint && clickCoordinates) { // if no points are selected

      const {lng, lat} = clickCoordinates;

      const newPointsArray = [...pointsArray]
      .filter((point) => point.id !== `${color}-marker`);
      
      newPointsArray.push(
        {
          id: `${color}-marker`,
          coordinates: [lng, lat],
        }
      );
      setPointsArray(newPointsArray);
      console.log('check');
      
      return;  
    }

    if (selectedPoint) {
      if (selectedPoint.id === `${color}-marker`) {
        return;
      }

      console.log(selectedPoint.id);
      console.log(color);
      
      

      const newPointsArray = [...pointsArray]
      .filter((point) => point.id !== `${color}-marker` && point.id !== selectedPoint.id);

      newPointsArray.push(
        {
          id: `${color}-marker`,
          coordinates: selectedPoint.coordinates,
        }
      );

      setPointsArray(newPointsArray);
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

