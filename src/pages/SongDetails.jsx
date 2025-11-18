import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs, SongCard, SEO } from "../components";


import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {  useGetSongByNameQuery, useGetSongDetailsQuery, useGetSongRelatedQuery } from "../redux/services/songsApi";
import { useEffect } from "react";
import { useGetArtistDetailsQuery } from "../redux/services/artistApi";

const SongDetails = () => {
    const dispatch = useDispatch()
    const { songid } = useParams()
    const { activeSong, isPlaying } = useSelector(state => state.player)
    const { data: songData, isFetching: isFetchingSongDetails, isSuccess: isSuccess, isError: error } = useGetSongDetailsQuery(songid)
    // const { data: relatedSong, isFetching: isFetchingRelatedSong, error} = useGetSongRelatedQuery(isSuccess? songData?.data?.id : "")
    const songs = useGetSongByNameQuery(isSuccess ? songData?.data?.attributes?.artist?.data?.attributes?.name : "").data
    const { data: artistData, isFetching: isFetchingArtistDetails, isError: errorArtiste } = useGetArtistDetailsQuery(songData?.data?.attributes?.artist?.data?.id)
    const streams = useSelector(state => state.streams)

    const relatedSong = songs?.data?.filter((song) => song.attributes?.artist?.data?.id === Number(songData?.data?.attributes.artist?.data?.id))

    const handlePauseClick = () => {
        dispatch(playPause(false))
    }

    const handlePlayClick = (song, i) => {
        dispatch(setActiveSong({ song, i }))
        dispatch(playPause(true))
    }

    useEffect(() => {

    }, [songData])

    if (isFetchingSongDetails) return <Loader title="Searching song details" />
    if (error) return <Error />

    console.log('streams details', streams)

    // Préparer les données SEO
    const songName = songData?.data?.attributes?.name || 'Chanson';
    const artistName = songData?.data?.attributes?.artist?.data?.attributes?.name || '';
    const songTitle = `${songName}${artistName ? ` - ${artistName}` : ''} | Diabara TV`;
    const songDescription = `${songName}${artistName ? ` par ${artistName}` : ''} - Découvrez cette musique sur Diabara TV. La musique au bout des doigts.`;
    // Formater l'URL de l'image pour Facebook
    const formatImageUrl = (imageUrl) => {
      if (!imageUrl) return 'https://diabara.tv/logo.png';
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      return `https://api.diabara.tv${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
    };
    
    const songImage = songData?.data?.attributes?.cover?.data?.[0]?.attributes?.formats?.small?.url 
      ? formatImageUrl(songData.data.attributes.cover.data[0].attributes.formats.small.url)
      : songData?.data?.attributes?.cover?.data?.[0]?.attributes?.url
        ? formatImageUrl(songData.data.attributes.cover.data[0].attributes.url)
        : 'https://diabara.tv/logo.png';
    const songUrl = `https://diabara.tv/songs/${songid}`;

    return (
        <>
          <SEO
            title={songTitle}
            description={songDescription}
            image={songImage}
            url={songUrl}
            type="music.song"
          />
            <div className="flex flex-col">
            {console.log('sond', songData)}
            {console.log('art', artistData)}
            
            <DetailsHeader artiste_id="" songData={songData} artistData={artistData} />


            <div className="flex items-center justify-center w-full">
                <SongCard
                    detail={'w-full'}
                    key={songData?.data.id}
                    song={songData.data}

                    isPlaying={isPlaying}
                    activeSong={activeSong}
                    data={relatedSong}
                    streams={streams}
                />
            </div>

            <div className="mb-10">
                <h2 className="text-white text-3xl font-bold" >Lyrics:</h2>
                <div className="mt-5">
                    {songData?.lyrics ?

                        songData?.lyrics.text.map((line, i) => (
                            <p className="text-gray-400  text-base my-1" key={i}>line</p>
                        )) : <p className="text-gray-400  text-base my-1">
                            Sorry, no lyrics found!
                        </p>

                    }
                </div>
            </div>

            <RelatedSongs
                data={relatedSong}
                isPlaying={isPlaying}
                activeSong={activeSong}

                handlePauseClick={handlePauseClick}
                handlePlayClick={handlePlayClick}
            />
        </div>
        </>
       
    )
};

export default SongDetails;
