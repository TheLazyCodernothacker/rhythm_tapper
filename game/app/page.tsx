"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  let rhythms = [
    { dur: 4, rest: true, compl: false },
    { dur: 4, rest: true, compl: false },
    { dur: 4, rest: true, compl: false },
    { dur: 4, rest: true, compl: false },
    { dur: 4, rest: false, compl: false },
    { dur: 4, rest: false, compl: false },
    { dur: 4, rest: true, compl: false },
    { dur: 4, rest: false, compl: false },
    { dur: 8, rest: false, compl: false },
    { dur: 8, rest: false, compl: false },
    { dur: 4, rest: false, compl: false },
    { dur: 4, rest: false, compl: false },
    { dur: 8, rest: false, compl: false },
    { dur: 8, rest: false, compl: false },
    { dur: 2, rest: false, compl: false },
    { dur: 2, rest: false, compl: false },
    { dur: 16, rest: false, compl: false },
    { dur: 16, rest: false, compl: false },
    { dur: 16, rest: false, compl: false },
    { dur: 16, rest: false, compl: false },
    { dur: 1, rest: true, compl: false },
  ];
  rhythms.forEach((r, i) => (r.index = i));
  let [stateRhythms, setStateRhythms] = useState(rhythms);
  let bpm = 60;
  let frames = [];
  rhythms.forEach((rhythm) => {
    let indicator = "out-of-range";

    for (let i = 0; i < 800 / rhythm.dur / (bpm / 60); i++) {
      indicator = "out-of-range";
      if (i < (800 * 0.2) / rhythm.dur / (bpm / 60)) indicator = "in-range";
      if (i >= (800 * 0.8) / rhythm.dur / (bpm / 60)) indicator = "early";

      frames.push([rhythm.index, indicator]);
    }
  });
  const barRef = useRef(null);
  const line = useRef(null);
  let [started, setStarted] = useState(false);
  function playClick() {
    let audio = new Audio("/click.mp3");
    audio.play();
  }
  function playSnare() {
    let audio = new Audio("/snare.mp3");
    audio.play();
  }
  function start() {
    let frame = 0;
    setStarted(true);
    setInterval(() => {
      barRef.current.style.transform += `translateX(-${bpm / 60}px)`;
      if (frame % (200 / (bpm / 60)) == 0 && frame < frames.length) playClick();

      frame++;
    }, 5);
    function handleTap() {
      if (frame >= frames.length) return;
      playSnare();
      if (stateRhythms[frames[frame][0]].rest) return;
      if (frames[frame][1] == "in-range") {
        console.log("compl");
        setStateRhythms((rhythms) => {
          let newRhythms = [...rhythms];
          newRhythms[frames[frame][0]].compl = true;
          return newRhythms;
        });
        frame++;
      } else if (frames[frame][1] == "early") {
        if (!frames[frame + 1]) return;
        console.log("early");
        setStateRhythms((rhythms) => {
          let newRhythms = [...rhythms];
          newRhythms[frames[frame + 1][0]].compl = true;
          return newRhythms;
        });
      } else {
        console.log("fail");
        setStateRhythms((rhythms) => {
          let newRhythms = [...rhythms];
          newRhythms[frames[frame][0]].fail = true;
          return newRhythms;
        });
      }
    }
    window.addEventListener("keydown", (e) => {
      handleTap();
    });
  }

  return (
    <main>
      <h1 className="text-6xl text-center m-8 font-bold text-sky-600">
        Rhythm Tappers
      </h1>
      <div className=" m-8 overflow-hidden flex">
        <span className="bg-sky-700 w-4 z-20" ref={line}></span>
        <div className="flex flex-nowrap ml-4" ref={barRef}>
          {stateRhythms.map((rhythm, index) => (
            <div
              key={index}
              className={`relative  text-white ${
                rhythm.compl
                  ? "bg-green-600"
                  : rhythm.fail
                  ? "bg-red-600"
                  : rhythm.rest
                  ? "bg-gray-500"
                  : "bg-sky-600"
              } flex items-center justify-center p-4 `}
              style={{
                flex: `${800 / rhythm.dur - 10}px 0 0`,
                height: "200px",
                marginLeft: index === 0 ? "0px" : "10px",
                boxSizing: "border-box",
              }}
            >
              1 / {rhythm.dur}
            </div>
          ))}
        </div>
      </div>
      {!started ? (
        <button
          onClick={start}
          className="mt-8 mx-auto block py-4 px-12 text-2xl text-white bg-sky-600 rounded"
        >
          Start
        </button>
      ) : (
        <h1>aedsf</h1>
      )}
    </main>
  );
}
