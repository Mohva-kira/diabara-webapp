import React from 'react'
import { VideoPlayer } from '../components';
import { useParams } from 'react-router-dom';

const Video = () => {

  const {id} = useParams()
  console.log('Video ID', id)

  return (
    <div className='w-full'>
          <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
              <h2 className="font-bold text-3xl text-white text-left">
                {" "}
                Video 
              </h2>
             
            </div>

            <div>
                <VideoPlayer id={id}  />
            </div>
    </div>
  )
}

export default Video
