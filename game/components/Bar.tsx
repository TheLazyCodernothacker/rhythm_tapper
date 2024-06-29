"use client";
import { useRef, useState } from "react";

export default function Bar({ rhythms, POE, bpm }) {
  rhythms.forEach((r, i) => (r.index = i));
  let [stateRhythms, setStateRhythms] = useState(rhythms);

  let frames = [];
  rhythms.forEach((rhythm, index) => {
    let indicator = "out-of-range";

    for (let i = 0; i < 800 / rhythm.dur / (bpm / 60); i++) {
      indicator = "out-of-range";
      if (i < (800 * POE * 0.01) / rhythm.dur / (bpm / 60)) {
        indicator = "in-range";
      }
      if (
        i >= (800 * (1 - POE * 0.01)) / rhythm.dur / (bpm / 60) &&
        index < rhythms.length - 1
      ) {
        indicator = "early";
        frames.push([rhythm.index + 1, indicator]);
        continue;
      }

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
  function handleTap(e) {
    //checkk if mouse click or space hit
    if (e.type !== "mousedown" && e.code !== "Space") return;
    let frame = window.frame;
    console.log(frame);
    if (frame >= frames.length) return;
    playSnare();
    if (stateRhythms[frames[frame][0]].rest) return;
    if (stateRhythms[frames[frame][0]].compl) {
      console.log("compl");
      setStateRhythms((rhythms) => {
        let newRhythms = [...rhythms];
        newRhythms[frames[frame][0]].fail = true;
        return newRhythms;
      });
      frame++;
      return;
    }
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
  function start() {
    window.frame = 0;
    setStarted(true);
    setInterval(() => {
      barRef.current.style.transform += `translateX(-${bpm / 60}px)`;
      if (frame % (200 / (bpm / 60)) == 0 && frame < frames.length) playClick();

      frame++;
    }, 5);

    window.addEventListener("keydown", (e) => {
      handleTap(e);
    });
  }
  return (
    <>
      <div className=" m-8 overflow-hidden flex">
        <span className="bg-sky-700 w-4 z-20" ref={line}></span>
        <div className="flex flex-nowrap ml-4" ref={barRef}>
          {stateRhythms.map((rhythm, index) => (
            <div
              key={index}
              className={`relative  text-white ${
                rhythm.fail
                  ? "bg-red-600"
                  : rhythm.compl
                  ? "bg-green-600"
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
        <div
          className="w-full h-48 bg-gray-400 rounded mx-8"
          onMouseDown={handleTap}
        ></div>
      )}
    </>
  );
}
