import { useRef } from 'react';

export default function ControlBar() {

  const controlBar = useRef(null);


  return (
    <div ref={ controlBar } className='control-bar'>

      <p> TEST</p>

    </div>
  );
}

