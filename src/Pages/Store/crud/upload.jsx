import React from 'react'
import { useParams } from 'react-router-dom';

export const Upload = () => {
  const {id} = useParams();
  return (
    <div>
      <p>TESTTTT</p>
      {id}
      {console.log('id in upload page', id)}
    </div>
  )
}

export default Upload;