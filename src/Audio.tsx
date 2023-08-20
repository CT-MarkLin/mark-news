import { FC, useEffect, useRef, useState } from 'react';

interface IAudio {
  data: string;
  onEnd: () => void;
}

export const Audio: FC<IAudio> = ({ data, onEnd }) => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [readIndex, setReadIndex] = useState<number>(0);

  const audioRef = useRef<HTMLMediaElement>(null);
  useEffect(() => {
    if (!data || !audioRef.current) {
      return;
    }
    console.log({ snippets });
    const url = `https://mark-tts.deno.dev/?text=${snippets[readIndex]}`;
    const audioObj = audioRef.current;
    audioObj.pause();
    audioObj.src = url;
    audioObj.addEventListener('loadeddata', () => {
      audioObj.play();
      // duration 变量现在存放音频的播放时长（单位秒）
    });
    audioObj.addEventListener('ended', () => {
      if (readIndex === snippets.length - 1) {
        onEnd();
        return;
      }
      setReadIndex(readIndex + 1);
    });
    audioObj.addEventListener('error', () => {
      onEnd();
    });
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
      <audio style={{ width: '100%' }} ref={audioRef} controls />
    </>
  );
};
