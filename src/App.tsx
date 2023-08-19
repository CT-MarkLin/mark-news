import { useEffect, useState } from 'react';
import './App.css';

const getDate = (date: any) => {
  const a = new Date(date);
  const year = a.getFullYear();
  const month = a.getMonth() + 1;
  const day = a.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${
    day < 10 ? '0' + day : day
  }`;
};

const speech = (content: string) => {
  return new Promise((resolve) => {
    const audioObj = new Audio(`https://mark-tts.deno.dev/?text=${content}`);
    audioObj.addEventListener('loadeddata', () => {
      audioObj.play();
      // duration 变量现在存放音频的播放时长（单位秒）
    });
    audioObj.addEventListener('ended', () => {
      resolve(true);
    });
    // let speechInstance = new window.SpeechSynthesisUtterance(`${content}`);
    // speechInstance.onend = () => {
    //   resolve(true);
    // };
    // window.speechSynthesis.speak(speechInstance);
  });
};

function App() {
  const [date, setDate] = useState<number>();
  const [readIndex, setReadIndex] = useState<number>();
  const [data, setData] = useState<{ title: any[]; content: any[] }>();

  useEffect(() => {
    const d = getDate(date).replace(/-/g, '');
    fetch(`https://tech-news.deno.dev?d=${d}`).then(async (res) => {
      if (!res) {
        return;
      }
      const newData = (await res.json()) as any;
      console.log(newData);
      setData(newData);
    });
  }, [date]);

  useEffect(() => {
    if (!data || !data.title) {
      return;
    }
    setReadIndex(0);
    // let speechInstance = new window.SpeechSynthesisUtterance(
    //   `${data.title[0]}。。。${data.content[0]}`
    // );
    // window.speechSynthesis.speak(speechInstance);
  }, [data]);

  useEffect(() => {
    if (!data || !data.title || readIndex === undefined || !date) {
      return;
    }
    speech(`${data.title[readIndex]}。。。${data.content[readIndex]}`).then(
      () => {
        setTimeout(() => {
          if (readIndex < data.title.length) {
            setReadIndex(readIndex + 1);
          } else {
            setDate(date - 1000 * 3600 * 24);
          }
        }, 2000);
      }
    );
  }, [readIndex]);

  return (
    <>
      <div>
        <input
          value={getDate(date)}
          onChange={(evt) => setDate(new Date(evt.target.value).valueOf())}
          type="date"
        />
        {new Array(20).fill(0).map((_, ind) => (
          <button
            style={{ marginRight: '1vw' }}
            onClick={() =>
              setDate(new Date().valueOf() - ind * 1000 * 3600 * 24)
            }
            key={ind}
          >
            {getDate(new Date().valueOf() - ind * 1000 * 3600 * 24)}
          </button>
        ))}
      </div>
      {data &&
        data.title.map((item, ind) => {
          return (
            <div
              onClick={() => setReadIndex(ind)}
              className={(ind === readIndex && 'active') || ''}
              key={ind}
            >
              <h3>{item}</h3>
              <p>{data.content[ind]}</p>
            </div>
          );
        })}
    </>
  );
}

export default App;
