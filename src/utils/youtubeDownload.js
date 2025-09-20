
// import { Downloader } from 'ytdl-mp3';
import axios from 'axios';

let videoID = ''
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_KEY;

export const download = async (id) => {


  // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
  // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
  // TypeScript: import ytdl = require('ytdl-core'); with neither of the above

  // await downloader.downloadSong('https://www.youtube.com/watch?v=7jgnv0xCv-k');
  axios.post('http://localhost:3100/' + id, {
    name: 'Fred',
    image: 'Flintstone'
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
export const youtubeSearch = async (data) => {

  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      maxResults: 15,
      key: YOUTUBE_API_KEY,
      q: data,
    },
  });
  return response.data.items;

};



