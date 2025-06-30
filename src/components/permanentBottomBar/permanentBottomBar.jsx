import { useRef } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function PermanentBottomBar() {

  const permanentBottomBar = useRef(null);

  return (
    <div ref={ permanentBottomBar } className='permanent-bottom-bar'>
    </div>
  );
}

