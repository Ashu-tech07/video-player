import './App.css';
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import Container from '@mui/material/Container';
import { ControlButtons } from './components/ControlButtons';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { Box, Button, IconButton, Typography } from '@mui/material';
import data from './videoList.json'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const format = (seconds) => {
  if (isNaN(seconds)) {
    return '00:00'
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
  } else {
    return `${mm}:${ss}`
  }
};
function App() {

  const [playerstate, setPlayerState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playerbackRate: 1.0,
    played: 0,
    seeking: false,
  })
  const [videoDetails,setVideoDetails]= useState({
    videoUrl:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    videoTitle:"For Bigger Fun",
  })
  const { playing, muted, volume, playerbackRate, played, seeking } = playerstate;
  const playerRef = useRef(null);
  const playerDivRef = useRef(null);

  const currentPlayerTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
  const movieDuration = playerRef.current ? playerRef.current.getDuration() : '00:00';
  const playedTime = format(currentPlayerTime);
  const fullMovieTime = format(movieDuration);
  const handlePlayAndPause = () => {
    setPlayerState({
      ...playerstate,
      playing: !playerstate.playing
    })
  }

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds')
  }
  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds')
  }

  const handlePlayerProgress = (state) => {
    console.log('onProgress', state);
    if (!playerstate.seeking) {
      setPlayerState({ ...playerstate, ...state })
    }
    console.log('afterProgress', state);
  }

  const handlePlayerSeek = (e,newValue) => {
    setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
    playerRef.current.seekTo(parseFloat(newValue / 100));
  }
  const handlePlayerMouseSeekDown = (e) => {
    setPlayerState({...playerstate, seeking: true});
  }

  const handlePlayerMouseSeekUp = (newValue) => {
    setPlayerState({ ...playerstate, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  }

  const handleMuting = () => {
    setPlayerState({ ...playerstate, muted: !playerstate.muted })
  }

  const handleVolumeChange = (e, newValue) => {
    setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
  }


  const handleVolumeSeek = (e, newValue) => {
    setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handlePlayerRate = (rate) => {
    setPlayerState({ ...playerstate, playerbackRate: rate });
  }

  const handleFullScreenMode = () => {
    screenfull.toggle(playerDivRef.current);
  }

  return (

    <>
      <header className='header__section'>
        <p className='header__text'>Video Player</p>
      </header>
      <Container maxWidth="md">
        <div className='playerDiv' ref={playerDivRef}>
          <ReactPlayer width={'100%'} height='100%'
            url={videoDetails.videoUrl}
            ref={playerRef}
            playing={playing}
            muted={muted}
            volume={volume}
            //controls={true}
            onProgress={handlePlayerProgress}
            playbackRate={playerbackRate}
          />
          <ControlButtons
          key={volume.toString()}
            playandpause={handlePlayAndPause}
            playing={playing}
            rewind={handleRewind}
            fastForward={handleFastForward}
            played={played}
            onSeek={handlePlayerSeek}
            onSeekMouseUp={handlePlayerMouseSeekUp}
            onSeekMouseDown={handlePlayerMouseSeekDown}
            playedTime={playedTime}
            fullMovieTime={fullMovieTime}
            muting={handleMuting}
            muted={muted}
            volume={volume}
            volumeChange={handleVolumeChange}
            volumeSeek={handleVolumeSeek}
            playerbackRate={playerbackRate}
            playRate={handlePlayerRate}
            fullScreenMode={handleFullScreenMode}
            seeking={seeking}
            videoTitle={videoDetails.videoTitle}
          />
        </div>
      </Container>
      <Divider style={{ 
        marginTop:'2rem',
      }}/>
      <Paper id='paper' elevation={0} style={{
        overflowX:'auto',
      }}>
        {
          data.videos.map((item)=>{
            return (
              <>
             <Box style={{ display:'inline-flex', width:'80%'}}><Button variant='text' style={{flexGrow:1,
             marginLeft:'15rem', justifyContent:'flex-start'
             }} onClick={()=>{
                setVideoDetails({
                  videoUrl: item.sources[0],
                  videoTitle: item.title
                })
              }}>
              <Typography style={{
              fontSize:'16px',
              }}
              >{item.title}</Typography></Button> 
               <IconButton className='controls__icons' onClick={()=>{
                setVideoDetails({
                  videoUrl: item.sources[0],
                  videoTitle: item.title
                })
              }}>
                    <PlayCircleOutlineIcon fontSize='small'/>
                </IconButton></Box>
             <Divider/>
             
             </>
            )
          })
        }
      </Paper>
    </>
  );
}

export default App;
