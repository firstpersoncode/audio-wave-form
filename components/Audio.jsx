import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import colormap from "colormap";

export default function Audio({ audio }) {
  const waveformRef = useRef(null);
  const waveSpectrogramRef = useRef(null);
  const wavesurfer = useRef(null);
  const [ready, setReady] = useState(false);
  const [play, setPlay] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    setPlay(false);
    const create = async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      const SpectrogramPlugin = (
        await import("wavesurfer.js/dist/plugin/wavesurfer.spectrogram")
      ).default;
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#aaa",
        progressColor: "blue",
        cursorColor: "red",
        barWidth: 1,
        height: 300,
        plugins: [
          SpectrogramPlugin.create({
            wavesurfer: wavesurfer.current,
            container: waveSpectrogramRef.current,
            frequencyMax: 8000,
            labels: true,
            colorMap: colormap({
              colormap: "plasma",
              nshades: 256,
              format: "float",
            }),
          }),
        ],
      });

      wavesurfer.current.on("ready", function () {
        wavesurfer.current.setVolume(0.5);
        setMute(false);
        setVolume(50);
        setTime(0);
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on("audioprocess", function () {
        setTime(wavesurfer.current.getCurrentTime());
      });

      wavesurfer.current.on("seek", function (progress) {
        setTime(progress * wavesurfer.current.getDuration());
      });

      wavesurfer.current.load(audio);
    };

    create();

    return () => wavesurfer.current && wavesurfer.current.destroy();
  }, [ready, audio]);

  function handlePlayPause() {
    setPlay((v) => !v);
    wavesurfer.current.playPause();
  }

  function handleMute() {
    setMute((v) => {
      let currMute = !v;
      wavesurfer.current.setVolume(currMute ? 0 : volume / 10);
      return currMute;
    });
  }

  function onVolumeChange(e, value) {
    setVolume(value);
    wavesurfer.current.setVolume(value / 10);
  }

  return (
    <>
      <Typography sx={{ mb: 2, color: "#5F6368" }} variant="h5">
        Anomaly Machine Output
      </Typography>
      <Box
        sx={{
          display: "inline-flex",
          gap: 2,
          alignItems: "center",
          backgroundColor: "#ddd",
          p: 1,
          borderRadius: 10,
        }}
      >
        <IconButton onClick={handlePlayPause}>
          {!play ? <PlayArrow /> : <Pause />}
        </IconButton>
        <Typography variant="body2">
          {formatTime(time)} / {formatTime(duration)}
        </Typography>
        <Slider sx={{ width: 100 }} value={volume} onChange={onVolumeChange} />
        <IconButton onClick={handleMute}>
          {!mute ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
      </Box>

      <Box sx={{ my: 2 }} id="waveform" ref={waveformRef} />
      <Box sx={{ my: 2 }} id="wave-spectrogram" ref={waveSpectrogramRef} />
    </>
  );
}

function formatTime(time) {
  return [
    Math.floor((time % 3600) / 60), // minutes
    ("00" + Math.floor(time % 60)).slice(-2), // seconds
  ].join(":");
}
