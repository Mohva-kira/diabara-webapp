import React from "react";

/**
 * Props:
 * - songId: id de la chanson
 * - song: objet song (optionnel, passé à Download si nécessaire)
 * - user: objet user (null si non connecté)
 * - streams: nombre ou données de streams
 * - Like, Playlist, Download, StreamsComponent: composants à rendre (passer les composants importés)
 * - showLike, showPlaylist, showDownload, showStreams: bool pour afficher/masquer
 * - className: classes additionnelles pour le container
 */
const SongActions = ({
  songId,
  song,
  user,
  streams,
  Like,
  Playlist,
  Download,
  StreamsComponent,
  showLike = true,
  showPlaylist = true,
  showDownload = true,
  showStreams = true,
  className = "",
}) => {
  const stop = (e) => e.stopPropagation();

  return (
    <div className={`flex flex-row md:items-end items-center md:justify-end justify-center md:gap-4 ${className}`}>
      {showLike && user && Like && (
        <div onClick={stop} className="flex items-center">
          <Like song={songId} user={user?.user?.id} />
        </div>
      )}

      {showPlaylist && user && Playlist && (
        <div onClick={stop} className="flex items-center">
          <Playlist song={songId} user={user?.user?.id} />
        </div>
      )}

      {showDownload && user && Download && (
        <div onClick={stop} className="flex items-center">
          <Download song={song} user={user?.user} />
        </div>
      )}

      {showStreams && StreamsComponent && (
        <div onClick={stop} className="flex items-center">
          <StreamsComponent song={songId} user={user?.user?.id} streams={streams} />
        </div>
      )}
    </div>
  );
};

export default SongActions;