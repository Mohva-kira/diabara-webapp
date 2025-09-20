import React, { useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Error, Loader, SearchResCard, SongCard } from "../components";
import { useGetSongByNameQuery } from "../redux/services/songsApi";

import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useGetArtistsByNameQuery } from "../redux/services/artistApi";
import { youtubeSearch } from "../utils/youtubeDownload";

const Search = () => {
  const { searchTerm } = useParams();

  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongByNameQuery(searchTerm);
  const {
    data: artistData,
    isFetching: artistFetching,
    error: artistError,
  } = useGetArtistsByNameQuery(searchTerm);

  const [webResult, setWebResult] = useState();

  const songs = data?.data.map((song) => song.url);
  const artists = artistData?.data.map((artist) => artist.attributes.name);
  console.log("artists dataa", artistData);
  console.log("songs dataa", data);
  ReactGA.send({
    hitType: "pageview",
    page: `/search/${searchTerm}`,
    title: `${searchTerm}`,
  });
  const webEx = [
    {
      kind: "youtube#searchResult",
      etag: "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      id: {
        kind: "youtube#video",
        videoId: "WXqZngVZerw",
      },
      snippet: {
        publishedAt: "2024-12-14T00:12:20Z",
        channelId: "UCck5J0M6YKnXCrnuXkCFuvw",
        title: "HIMRA - BANGER (Clip Officiel)",
        description:
          "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Himra officiel",
        liveBroadcastContent: "none",
        publishTime: "2024-12-14T00:12:20Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      id: {
        kind: "youtube#video",
        videoId: "WXqZngVZerw",
      },
      snippet: {
        publishedAt: "2024-12-14T00:12:20Z",
        channelId: "UCck5J0M6YKnXCrnuXkCFuvw",
        title: "HIMRA - BANGER (Clip Officiel)",
        description:
          "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Himra officiel",
        liveBroadcastContent: "none",
        publishTime: "2024-12-14T00:12:20Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      id: {
        kind: "youtube#video",
        videoId: "WXqZngVZerw",
      },
      snippet: {
        publishedAt: "2024-12-14T00:12:20Z",
        channelId: "UCck5J0M6YKnXCrnuXkCFuvw",
        title: "HIMRA - BANGER (Clip Officiel)",
        description:
          "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Himra officiel",
        liveBroadcastContent: "none",
        publishTime: "2024-12-14T00:12:20Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      id: {
        kind: "youtube#video",
        videoId: "WXqZngVZerw",
      },
      snippet: {
        publishedAt: "2024-12-14T00:12:20Z",
        channelId: "UCck5J0M6YKnXCrnuXkCFuvw",
        title: "HIMRA - BANGER (Clip Officiel)",
        description:
          "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Himra officiel",
        liveBroadcastContent: "none",
        publishTime: "2024-12-14T00:12:20Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      id: {
        kind: "youtube#video",
        videoId: "WXqZngVZerw",
      },
      snippet: {
        publishedAt: "2024-12-14T00:12:20Z",
        channelId: "UCck5J0M6YKnXCrnuXkCFuvw",
        title: "HIMRA - BANGER (Clip Officiel)",
        description:
          "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Himra officiel",
        liveBroadcastContent: "none",
        publishTime: "2024-12-14T00:12:20Z",
      },
    },
  ];

  useEffect(() => {
    if (data?.data.length == 0 || artistData?.data.length == 0) {
      if (searchTerm) {
        youtubeSearch(searchTerm)
          .then((videos) => {
            console.log("Résultat des vidéos:", videos);
            setWebResult(videos);
            const videoID = videos[0]?.id?.videoId;
            console.log("Le ID video:", videoID);
          })
          .catch((error) => {
            console.error("Erreur lors du fetch des vidéos:", error);
            setWebResult([]); // Éviter le blocage
          });
      }
    }
  }, [data, artistData]);

  if (!data || !artistData || !webResult?.length) {
    return <Loader title="Loading Top charts" />;
  }
  // if (isFetching ) return <Loader title="Loading Top charts" />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      {console.log("Résultat du web:", webResult)}
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Resultat de la recherche{" "}
        <span className="font-balck">{searchTerm}</span>
      </h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.data?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isFetching}
            data={data}
            i={i}
          />
        ))}
        {webResult?.map((song, i) => (
          <SearchResCard item={song} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Search;
