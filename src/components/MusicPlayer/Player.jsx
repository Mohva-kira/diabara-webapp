/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useState } from 'react';
import { setStreams, useGetStreamsQuery, usePostStreamsMutation } from '../../redux/services/streams';
import { usePlayedMutation } from '../../redux/services/songsApi';
import { useDispatch, useSelector } from 'react-redux';
import { logEvent } from '../../analytics';
import { trackFirstPlay } from '../../services/funnelTracking';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);

  const [streamTime, setStreamTime] = useState(0)
  const [startTime, setStartTime] = useState()
  const [streamStarted, setStreamStarted] = useState(false)
  const [playRecorded, setPlayRecorded] = useState(false)
  const [streamRecorded, setStreamRecorded] = useState(false)
  const [postStream] = usePostStreamsMutation()
  const [postPlayed] = usePlayedMutation()
  const {data: streamData, currentData, refetch} = useGetStreamsQuery()
  const stateUser = useSelector(state => state.auth)
  const storageUser =  localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth'))
  const user = stateUser?.auth?.user ? stateUser : storageUser
  const song = useSelector(state =>  state.player.activeSong) 
  const dispatch = useDispatch()

  const updateStreamTime = () => {
    if (streamStarted && ref.current) {
      setStreamTime(ref.current.currentTime);
    }
  };
  
  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;
  const myUuid = localStorage.getItem('diabaratv_deviceId')
  const {onLine} = window.navigator

  // Vérifier si ce stream existe déjà
  const find = streamData?.data?.find(item => 
    item.attributes?.uuid === myUuid && 
    item?.attributes?.song?.data?.id === song?.id
  )

  // Enregistrer la lecture (played) au début
  const recordPlay = async () => {
    if (!playRecorded && user?.user?.id && song?.id) {
      try {
        await postPlayed({
          data: {
            song: song.id,
            user: user.user.id,
            visitor: myUuid,
          },
        });
        setPlayRecorded(true);
        console.log('Play recorded successfully');
        logEvent('play', 'song_played', song.attributes?.name || '');
        
        // Tracker le premier play (Étape 6 du funnel)
        trackFirstPlay({
          userId: user.user.id,
          contentType: 'music',
          contentId: song.id,
          contentName: song.attributes?.name || 'Unknown',
        });
      } catch (error) {
        console.error('Error recording play:', error);
      }
    }
  };

  // console.log('stream Time', streamTime)
  // console.log('found', find)
  // console.log('StreamData', streamData)
  // console.log('uuid', myUuid)
  
  
  const checkStreamDuration = async () => {
    // Enregistrer un stream après 1 minute 30 secondes (90 secondes)
    if (streamTime >= 90 && !find && !streamRecorded && user?.user?.id && song?.id) {
      console.log("Stream enregistré après 1min30 de lecture");

      setStreamRecorded(true);
      const data = {
        user: user.user.id, 
        song: song.id, 
        start: startTime, 
        end: new Date(), 
        uuid: myUuid
      };
      
      try {
        await postStream(JSON.stringify({data}));
        console.log('Stream enregistré avec succès');
        logEvent('stream', 'stream_completed', song.attributes?.name || '');
        refetch();
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du stream:', error);
        setStreamRecorded(false); // Permettre une nouvelle tentative
      }
    }
  };
  

  const startStream = () => {
    if (!streamStarted) {
      setStreamStarted(true);
      setStartTime(new Date());
      console.log('Stream démarré pour:', song?.attributes?.name);
    }
  };

  


  // Réinitialiser les états quand la chanson change
  useEffect(() => {
    setPlayRecorded(false);
    setStreamRecorded(false);
    setStreamStarted(false);
    setStreamTime(0);
    setStartTime(null);
  }, [song?.id]);

  // Enregistrer la lecture quand la chanson commence à jouer
  useEffect(() => {
    if (isPlaying && song?.id && !playRecorded) {
      recordPlay();
    }
  }, [isPlaying, song?.id, playRecorded]);

  // Démarrer le tracking du stream quand la lecture commence
  useEffect(() => {
    if (isPlaying && song?.id) {
      startStream();
    }
  }, [isPlaying, song?.id]);

  // Mettre à jour le temps de stream et vérifier la durée
  useEffect(() => {
    if (streamStarted) {
      updateStreamTime();
      checkStreamDuration();
    }
  }, [streamTime, streamStarted]);
 
  // Contrôler la lecture audio
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
        });
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying]);

  // Contrôler le volume
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Contrôler la position de lecture (seek)
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Mettre à jour les streams dans le store Redux
  useEffect(() => {
    if (currentData?.data) {
      dispatch(setStreams(currentData.data));
    }
  }, [currentData, dispatch]);



  // Gestionnaire personnalisé pour onTimeUpdate
  const handleTimeUpdate = (e) => {
    updateStreamTime();
    if (onTimeUpdate) {
      onTimeUpdate(e);
    }
  };

  return (
    <audio
      src={onLine ? `${API_FILE_URL}${activeSong?.attributes.audio?.data.attributes.url}` : activeSong.attributes.audio}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={handleTimeUpdate}
      onLoadedData={onLoadedData}
      onPlay={() => {
        console.log('Audio started playing');
        if (!playRecorded) {
          recordPlay();
        }
      }}
      onError={(e) => {
        console.error('Erreur audio:', e);
      }}
    />
  );
};

export default Player;
