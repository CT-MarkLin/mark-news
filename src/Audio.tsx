import { FC, useEffect, useRef } from 'react';

interface IAudio {
  data: string;
  onEnd: () => void;
}

export const Audio: FC<IAudio> = ({ data, onEnd }) => {
  // const [snippets, setSnippets] = useState<string[]>([]);
  // const [readIndex, setReadIndex] = useState<string[]>([]);

  const audioRef = useRef<HTMLMediaElement>(null);
  useEffect(() => {
    if (!data || !audioRef.current) {
      return;
    }
    const url = `https://mark-tts.deno.dev/?text=${data}`;
    const audioObj = audioRef.current;
    audioObj.pause();
    audioObj.src = url;
    audioObj.addEventListener('loadeddata', () => {
      audioObj.play();
      // duration 变量现在存放音频的播放时长（单位秒）
    });
    audioObj.addEventListener('ended', () => {
      onEnd();
    });
    audioObj.addEventListener('error', () => {
      onEnd();
    });
  }, [data, audioRef]);

  useEffect(() => {
    if (data.length <= 360) {
    }
  }, [data]);

  return (
    <>
      <audio style={{ width: '100%' }} ref={audioRef} controls />
    </>
  );
};
