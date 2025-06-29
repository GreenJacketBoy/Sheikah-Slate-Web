import ChoosePointMenu from '../choosePointMenu/choosePointMenu';
import ChoosePointActionMenu from '../choosePointActionMenu/choosePointActionMenu';
import { useEffect, useRef } from 'react';
import { click } from '@testing-library/user-event/dist/click';

export default function ControlBar({ pointsArray, setPointsArray, clickCoordinates, selectedPoint, setSelectedPoint, markerAndIcons, setClickCoordinates, displayedMenus, setDisplayedMenus }) {

  const controlBar = useRef(null);
  const displayedMenusRef = useRef(displayedMenus);

  useEffect(() => {
    displayedMenusRef.current = displayedMenus;    
  }, [displayedMenus]);


  // should account for every possible state of selectedPoint and clickCoordinates (as in undefined or not)
  useEffect(() => {
    const choosePointActionDisplayed = displayedMenusRef.current.includes('choosePointAction');
    const choosePointDisplayed = displayedMenusRef.current.includes('choosePoint');    

    if (!clickCoordinates && !selectedPoint) {
      menuEdit([], ['choosePoint', 'chooseActionPoint']);
      return;
    }

    if (!clickCoordinates && selectedPoint) {
      menuEdit(['chooseActionPoint'], ['choosePoint']);
      return;
    }

    if (clickCoordinates && !selectedPoint) {
      menuEdit(['choosePoint'], ['chooseActionPoint']);
      return;
    }
  }, [selectedPoint, clickCoordinates]);


  const menuEdit = (arrayToAdd, arrayToRemove) => {
    const newDisplayedMenus = [
      ...displayedMenusRef.current.filter((menu) => !arrayToRemove.includes(menu) && !arrayToAdd.includes(menu)),
      ...arrayToAdd
    ];

    setDisplayedMenus(newDisplayedMenus);
  };

  return (
    <div ref={ controlBar } className='control-bar'>

      {displayedMenus.includes('chooseActionPoint') ?
        <ChoosePointActionMenu pointsArray={pointsArray} setPointsArray={setPointsArray} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setClickCoordinates={setClickCoordinates} displayedMenus={displayedMenus} setDisplayedMenus={setDisplayedMenus} ></ChoosePointActionMenu>
        : ''
      }

      {displayedMenus.includes('choosePoint') ?
        <ChoosePointMenu clickCoordinates={clickCoordinates} pointsArray={pointsArray} setPointsArray={setPointsArray} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} markerAndIcons={markerAndIcons} setClickCoordinates={setClickCoordinates} ></ChoosePointMenu>
        : ''
      }
    </div>
  );
}

