import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Audio } from './Audio';
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

function App() {
  const [date, setDate] = useState<number>();
  const [readIndex, setReadIndex] = useState<number>(0);
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

  // useEffect(() => {
  //   if (!data || !data.title) {
  //     return;
  //   }
  //   setReadIndex(0);
  //   // let speechInstance = new window.SpeechSynthesisUtterance(
  //   //   `${data.title[0]}。。。${data.content[0]}`
  //   // );
  //   // window.speechSynthesis.speak(speechInstance);
  // }, [data]);

  return (
    <div style={{ paddingBottom: '60px', overflowY: 'auto', height: '100vh' }}>
      <div>
        <input
          value={getDate(date)}
          onChange={(evt) => setDate(new Date(evt.target.value).valueOf())}
          type="date"
        />
        {new Array(20).fill(0).map((_, ind) => (
          <Button
            style={{ marginRight: '1vw' }}
            type={
              date === new Date().valueOf() - ind * 1000 * 3600 * 24
                ? 'primary'
                : 'default'
            }
            onClick={() =>{
              setReadIndex(0);
              setDate(new Date().valueOf() - ind * 1000 * 3600 * 24)
            }}
            key={ind}
          >
            {getDate(new Date().valueOf() - ind * 1000 * 3600 * 24)}
          </Button>
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
      <div
        style={{ position: 'fixed', bottom: '0', zIndex: '1', width: '80vw' }}
      >
        {date && data?.title && typeof readIndex === 'number' && (
          <Audio
            data={`${data?.title[readIndex]}。。。${data?.content[readIndex]}`}
            index={readIndex}
            onEnd={() => {
              setTimeout(() => {
                if (readIndex < data?.title.length) {
                  setReadIndex(readIndex + 1);
                } else {
                  setReadIndex(0);
                  setDate(date - 1000 * 3600 * 24);
                }
              }, 2000);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
