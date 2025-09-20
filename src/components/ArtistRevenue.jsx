import React, { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  ColumnDirective, 
  ColumnsDirective, 
  GridComponent,
  Page,
  Inject,
  Sort,
  Filter,
  Toolbar
} from '@syncfusion/ej2-react-grids';

// Icons
import { CgDollar } from 'react-icons/cg';
import { CiStreamOn } from 'react-icons/ci';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { FaMusic, FaCalendarAlt } from 'react-icons/fa';

// Redux - Correction de l'import
import { useGetSongByArtistQuery } from '../redux/services/songsApi'; // Changé
import { selectUser } from '../redux/features/userSlice';

// Components
import Loader from './Loader';
import Error from './Error';

const ArtistRevenue = ({ artistID }) => {
  const user = useSelector(selectUser);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Correction de la query
  const { 
    data: songData, 
    isFetching: isSongFetching, 
    isError: isSongError,
    error: songError 
  } = useGetSongByArtistQuery(artistID, {
    skip: !artistID
  });

    const treatData = () => {
        let result = []
        let myStreams = []
        streamsData?.data.map((item, index) => {

            let song = songData?.data.find(item2 => item2.id === item.attributes.song.data.id)

            item.attributes.song.data.id === song.id && item && myStreams.push({ item })

            result.push({ song, streams: myStreams })
        })

        setStreamed(result)
    }

    useEffect(() => {
        treatData()
    }, [streamsData, songData])
    console.log('My streams', streamed)

    return (
        <div className=' md:w-3/5 sm:w-full rounded-2xl flex flex-col p-2 m-2 shadow-lg shadow-orange-600 bg-opacity-40'>
            <div className='w-full mb-10 flex justify-center items-center flex-col flex-wrap gap-4'>
                <h2 className='text-slate-200 text-xl font-semibold   rounded-2xl'>Revenue</h2>


                <div className='w-full'>
                    <div className='flex p-4 m-4 justify-around font-semibold text-lg '>

                        <span className='rounded-xl w-1/2 m-2 p-2 flex flex-wrap gap-3 items-center justify-center shadow-2xl text-white' >  <CgDollar className='text-orange-500 text-3xl' /> 25 000 Fcfa </span>

                        <span className='rounded-xl w-1/2 m-2 p-2 flex flex-wrap gap-3 items-center justify-center shadow-2xl  text-white'  >  <CiStreamOn className='text-orange-500 text-3xl' /> 100.000 </span>
                    </div>

                </div>


            </div>


            <div className='w-full mb-10 rounded-2xl flex justify-center items-center flex-col flex-wrap gap-4'>


                <div className='w-full rounded-2xl '>
                    <GridComponent dataSource={data} className='rounded-2xl'>
                        <ColumnsDirective className='rounded-2xl'>
                            <ColumnDirective field='OrderID' headerText='Order ID' />
                            <ColumnDirective field='CustomerID' headerText='Customer ID' />
                            <ColumnDirective field='ShipCountry' headerText='Ship Country' />
                        </ColumnsDirective>
                    </GridComponent>

                </div>

            </div>



        </div>
    )
}

export default ArtistRevenue