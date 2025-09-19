import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs, Gallery } from "../components";

import { selectCurrentToken, selectCurrentUser } from "../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../db/db";

import { CgProfile } from "react-icons/cg";
import { GiWallet } from "react-icons/gi";
import { IoAlbums } from "react-icons/io5";
import { useGetArtistDetailsQuery } from "../redux/services/artistApi";
import { useEffect, useState } from "react";


const ArtistDetails = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const indexedSongs = useLiveQuery(() => db.songs.toArray());
  const indexedSongReverse = indexedSongs && indexedSongs;

  console.log('indexed', indexedSongReverse)
  const { activeSong, isPlaying } = useSelector(state => state.player)
  const [songs, setSongs] = useState()
  const data = useSelector(state => state.songs)
  
  
  const { id: artistId } = useParams()
  const { data: artistData, isFetching: isFetchingArtistDetails, isError: error } = useGetArtistDetailsQuery(artistId)

  

  const navigate = useNavigate()
  useEffect(() => {


    {console.log('related songs', songs)}


    const relatedSong = data.songs.data?.filter((song) => song.attributes.artist.data.id === Number(artistId))

    setSongs(relatedSong)
  }, [artistData])

  if (isFetchingArtistDetails) return <Loader title="Loading artist details" />
  if (error) return <Error />

  return (
    <div className="flex flex-col">
      <DetailsHeader artiste_id={artistId} artistData={artistData} songData={songs} />
 

      {artistData?.data.attributes.Biographie &&

        <p className="text-slate-300 text-xl font-light m-7 text-justify ">
          {artistData?.data.attributes.Biographie}
        </p>

      }


      <RelatedSongs
        data={songs}
        isPlaying={isPlaying}
        activeSong={activeSong}
        artistId={artistId}
      />


      {artistData?.data.attributes.image?.data &&
        <Gallery data={artistData?.data.attributes.image?.data} artist={artistData} />
      }


    </div>
  )
};

export default ArtistDetails;
