import { FC, useEffect, useRef, useState } from 'react';

interface IAudio {
  data: string;
  index: number;
  onEnd: (index: number) => void;
}

const cache: any = {};

export const Audio: FC<IAudio> = ({ data, index, onEnd }) => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [readIndex, setReadIndex] = useState<number>(0);

  const audioRef = useRef<HTMLMediaElement>(null);
  useEffect(() => {
    const audioObj = audioRef.current;
    if (!audioObj) {
      return;
    }
    clearInterval(cache.timer)
    cache.timer = setInterval(() => {
      if (audioObj.ended) {
        return
      }
      audioObj.play();
    }, 1000)
    return () => clearInterval(cache.timer)
  }, [audioRef])
  useEffect(() => {
    if (!data || !audioRef.current) {
      return;
    }
    console.log({ snippets, readIndex });
    const url = `https://edge-tts.deno.dev/?text=${snippets[readIndex]}`;
    const audioObj = audioRef.current;
    // audioObj.pause();
    audioObj.src = url;
  }, [audioRef, snippets, readIndex]);

  useEffect(() => {
    const maxLen = 360;
    const audioObj = audioRef.current;
    audioObj?.pause();
    if (data.length <= maxLen) {
      setSnippets([data]);
      setReadIndex(0);
    } else {
      const paragraphs = data.split('\n');
      const senteance = paragraphs.flatMap((item) => item.split('。'));
      let temp = '';
      let result: string[] = [];
      for (let i = 0; i < senteance.length; i++) {
        if (
          (temp + senteance[i]).length >= maxLen ||
          i === senteance.length - 1
        ) {
          result.push(temp);
          temp = senteance[i];
          continue;
        }
        temp += `。${senteance[i]}`;
      }
      setSnippets(result);
      setReadIndex(0);
    }
  }, [data]);

  return (
    <>
      <audio
        autoPlay
        style={{ width: '100%' }}
        ref={audioRef}
        controls
        onEnded={() => {
          if (readIndex === snippets.length - 1) {
            onEnd(index);
            return;
          }
          setReadIndex(readIndex + 1);
        }}
        onError={() => {
          onEnd(index);
        }}
      />
    </>
  );
};
