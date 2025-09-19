import React, { useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Error, Loader, SongCard, SearchResCard } from "../components";
import {
  useGetSongByNameQuery,
  useGetSongsBySearchQuery,
} from "../redux/services/songsApi";

import { youtubeSearch } from "../utils/youtubeDownload";
import { useEffect } from "react";
import ReactGA from "react-ga4";


const Search = () => {
  const { searchTerm } = useParams();

  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongByNameQuery(searchTerm);

  const [webResult, setWebResult] = useState();

  const songs = data?.data.map((song) => song.url);
  console.log("songs dataa", data);
  ReactGA.send({
    hitType: "pageview",
    page: `/search/${searchTerm}`,
    title: `${searchTerm}`,
  });
  const webEx =[ 
    {
    "kind": "youtube#searchResult",
    "etag": "sy9fbHxYXfAT5KLIGSyjfbKaikc",
    "id": {
        "kind": "youtube#video",
        "videoId": "WXqZngVZerw"
    },
    "snippet": {
        "publishedAt": "2024-12-14T00:12:20Z",
        "channelId": "UCck5J0M6YKnXCrnuXkCFuvw",
        "title": "HIMRA - BANGER (Clip Officiel)",
        "description": "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "Himra officiel",
        "liveBroadcastContent": "none",
        "publishTime": "2024-12-14T00:12:20Z"
    }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "sy9fbHxYXfAT5KLIGSyjfbKaikc",
      "id": {
          "kind": "youtube#video",
          "videoId": "WXqZngVZerw"
      },
      "snippet": {
          "publishedAt": "2024-12-14T00:12:20Z",
          "channelId": "UCck5J0M6YKnXCrnuXkCFuvw",
          "title": "HIMRA - BANGER (Clip Officiel)",
          "description": "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
          "thumbnails": {
              "default": {
                  "url": "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
                  "width": 120,
                  "height": 90
              },
              "medium": {
                  "url": "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
                  "width": 320,
                  "height": 180
              },
              "high": {
                  "url": "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
                  "width": 480,
                  "height": 360
              }
          },
          "channelTitle": "Himra officiel",
          "liveBroadcastContent": "none",
          "publishTime": "2024-12-14T00:12:20Z"
      }
      },
      {
        "kind": "youtube#searchResult",
        "etag": "sy9fbHxYXfAT5KLIGSyjfbKaikc",
        "id": {
            "kind": "youtube#video",
            "videoId": "WXqZngVZerw"
        },
        "snippet": {
            "publishedAt": "2024-12-14T00:12:20Z",
            "channelId": "UCck5J0M6YKnXCrnuXkCFuvw",
            "title": "HIMRA - BANGER (Clip Officiel)",
            "description": "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
            "thumbnails": {
                "default": {
                    "url": "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
                    "width": 120,
                    "height": 90
                },
                "medium": {
                    "url": "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
                    "width": 320,
                    "height": 180
                },
                "high": {
                    "url": "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
                    "width": 480,
                    "height": 360
                }
            },
            "channelTitle": "Himra officiel",
            "liveBroadcastContent": "none",
            "publishTime": "2024-12-14T00:12:20Z"
        }
        },
        {
          "kind": "youtube#searchResult",
          "etag": "sy9fbHxYXfAT5KLIGSyjfbKaikc",
          "id": {
              "kind": "youtube#video",
              "videoId": "WXqZngVZerw"
          },
          "snippet": {
              "publishedAt": "2024-12-14T00:12:20Z",
              "channelId": "UCck5J0M6YKnXCrnuXkCFuvw",
              "title": "HIMRA - BANGER (Clip Officiel)",
              "description": "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
              "thumbnails": {
                  "default": {
                      "url": "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
                      "width": 120,
                      "height": 90
                  },
                  "medium": {
                      "url": "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
                      "width": 320,
                      "height": 180
                  },
                  "high": {
                      "url": "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
                      "width": 480,
                      "height": 360
                  }
              },
              "channelTitle": "Himra officiel",
              "liveBroadcastContent": "none",
              "publishTime": "2024-12-14T00:12:20Z"
          }
          },
          {
            "kind": "youtube#searchResult",
            "etag": "sy9fbHxYXfAT5KLIGSyjfbKaikc",
            "id": {
                "kind": "youtube#video",
                "videoId": "WXqZngVZerw"
            },
            "snippet": {
                "publishedAt": "2024-12-14T00:12:20Z",
                "channelId": "UCck5J0M6YKnXCrnuXkCFuvw",
                "title": "HIMRA - BANGER (Clip Officiel)",
                "description": "HIMRA - BANGER Réalisé par Roland Gogo Extrait du projet « JEUNE & RICHE » disponible en streaming sur toutes les ...",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/WXqZngVZerw/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/WXqZngVZerw/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/WXqZngVZerw/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "Himra officiel",
                "liveBroadcastContent": "none",
                "publishTime": "2024-12-14T00:12:20Z"
            }
            },
]
  useEffect(() => {
    if (data?.data.length == 0) {
      setTimeout(() => {
        console.log(searchTerm);
        // Send Axios request here
        youtubeSearch(searchTerm)
          .then((videos) => {
            console.log("Résultat des vidéos:", videos);
            setWebResult(videos);
            const videoID = videos[0].id.videoId;
            console.log("Le ID video:", videoID);
          })
          .catch((error) => {
            console.error("Erreur:", error);
          });
      }, 3000);
    }
  }, [data]);

  if (isFetching || !webResult ) return <Loader title="Loading Top charts" />;
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
        { data?.data?.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isFetching}
                data={data}
                i={i}
              />
            ))

          }
          {webResult?.map((song, i) => 
            
              <SearchResCard item={song} i={i} />
            )}
      </div>
    </div>
  );
};

export default Search;
