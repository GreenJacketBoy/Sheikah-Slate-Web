import { useMemo, useRef } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function ChoosePointMenu({ clickCoordinates, pointsArray, setPointsArray, selectedPoint, setSelectedPoint, markerAndIcons, setClickCoordinates }) {

  const choosePointMenu = useRef(null);

  const {markerColors, iconTypes} = markerAndIcons;

  const colorsUsedStatusMemo = useMemo(() => {

    const colorsUsedStatus = []; 
    
    markerColors.forEach((color) => {
      colorsUsedStatus.push(
        {
          color: color,
          status: false,
        }
      );
    });

    pointsArray.forEach((point) => {
      if (point.id.endsWith('_marker')) {

        const color = point.id.replace('_marker', '');
        const obj = colorsUsedStatus.find((value) => value.color === color);
          
        obj.status = true;
      }
    });

    return colorsUsedStatus;
  }, [pointsArray]);


  /**
   * @param {string} type 'marker' or 'icon'
   * @param {string} visual the visual identifier, for example 'red' or 'sword'
   * @param {number} lng longitude
   * @param {number} lat latitude
   * @returns 
   */
  const addPointToArray = (type, visual, lng, lat) => {
    if (!type || !visual || !lng || !lat) {
      return;
    }

    let id = undefined;
    let newPointsArray = [...pointsArray]

    if (type === 'marker') {
      id = `${visual}_marker`;
    }
    else if (type === 'icon') {
      id = `${visual}_${lng}_${lat}_icon`;
    }
    else {
      throw new Error(`the only implemented types are marker and icon, not ${type}`);
    }

    if (selectedPoint) {
      // if we modify a point for the exact same point
      if (selectedPoint.id === id) {
        return;
      }
      
      if (type === 'marker') { // there can't be 2 markers with the same color
        newPointsArray = newPointsArray.filter((point) => point.id !== `${visual}_marker` && point.id !== selectedPoint.id);
      }
      else { // there can't be 2 icons with the same symbol at the same coordinates (which makes the id)
        newPointsArray = newPointsArray.filter((point) => point.id !== selectedPoint.id);
      }      
    }    

    newPointsArray.push(
      {
        id: id,
        coordinates: [lng, lat],
      }
    );

    setPointsArray(newPointsArray);
  };


  /**
   * @param {string} type 'marker' or 'icon'
   * @param {string} visual the visual identifier, for example 'red' or 'sword'
   */
  const onActionItemClicked = (type, visual) => {

    if (selectedPoint) {
      const lngLat = selectedPoint.coordinates;
      addPointToArray(type, visual, lngLat[0], lngLat[1]);

      setClickCoordinates(undefined);
      setSelectedPoint(undefined);
      return;  
    }

    if (clickCoordinates) {
      const {lng, lat} = clickCoordinates;
      addPointToArray(type, visual, lng, lat);

      setClickCoordinates(undefined);
      setSelectedPoint(undefined);
    }

  };


  const onCancelClicked = () => {
    setClickCoordinates(undefined);
    setSelectedPoint(undefined);
  }


  return (
    <div ref={ choosePointMenu } className='choose-point-menu'>

      <span className='stamp-box-title'>Stamp Box</span>


      <div className='icon-div'>
      {
        iconTypes.map((icon, index) => (
          <div className='point-image-container' onClick={() => onActionItemClicked('icon', icon)} >
            <img key={`icon_${index}`} src={`/Sheikah-Slate-Web/${icon}Icon.png`} alt={`${icon} icon`} />
          </div>
        ))
      }
      </div>

      <div className='marker-div'>
      {
        colorsUsedStatusMemo.map((colorStatus, index) => (
          <div className={`point-image-container ${colorStatus.status ? 'used-marker' : 'unused-marker'}`} onClick={colorStatus.status ? undefined : () => onActionItemClicked('marker', colorStatus.color)} >
            <img key={`icon_${index}`} src={`/Sheikah-Slate-Web/${colorStatus.color}Marker.png`} alt={`${colorStatus.color} marker`} />
          </div>
        ))
      }
      </div>

      <button className='action-bar-button' onClick={onCancelClicked}>Cancel</button>

    </div>
  );
}

