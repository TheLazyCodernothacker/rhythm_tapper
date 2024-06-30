"use client";
import { useRef, useState } from "react";

export default function Bar({ rhythms, POE, bpm }) {
  rhythms.forEach((r, i) => (r.index = i));
  let [stateRhythms, setStateRhythms] = useState(rhythms);
  let [finished, setFinished] = useState(false);

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
    if (frame >= frames.length) {
      return;
    }
    playSnare();
    if (stateRhythms[frames[frame][0]].rest) return;
    if (stateRhythms[frames[frame][0]].compl) {
      console.log("compl");
      setStateRhythms((rhythms) => {
        let newRhythms = [...rhythms];
        newRhythms[frames[frame][0]].fail = true;
        newRhythms[frames[frame][0]].compl = false;
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
        newRhythms[frames[frame][0]].compl = false;
        return newRhythms;
      });
    }
  }
  function Data() {
    let count = 0;
    let length = 0;
    stateRhythms.forEach((r) => {
      if (r.compl) count++;
      if (!r.rest) length++;
    });
    let score = (count / length) * 100;
    let message;
    switch (true) {
      case score < 50:
        message = "You need more practice";
        break;
      case score < 80:
        message = "Good Job!";
        break;
      case score < 90:
        message = "Great Job!";
        break;
      case score < 95:
        message = "Excellent!";
        break;
      case score < 99:
        message = "Amazing!";
        break;
      default:
        message = "Perfection!";
        break;
    }
    return (
      <>
        <h1 className="text-2xl text-center">Your Score is {score}%</h1>
        <h2 className="text-xl text-center">{message}</h2>
        <div className="flex flex-nowrap overflow-scroll w-1/2 mx-auto gap-2 mt-4">
          {stateRhythms.map((rhythm, index) => (
            <div
              className={`w-8 h-8 ${
                rhythm.rest
                  ? "bg-gray-500"
                  : rhythm.fail
                  ? "bg-red-600"
                  : rhythm.compl
                  ? "bg-green-600"
                  : "bg-sky-600"
              }`}
            ></div>
          ))}
        </div>
      </>
    );
  }
  function start() {
    window.frame = 0;
    setStarted(true);
    setInterval(() => {
      loop();
    }, 5);

    function loop() {
      let frame = window.frame;
      if (frame > frames.length) {
        setFinished(true);
        window.clearInterval(loop);
        return;
      }
      barRef.current.style.transform += `translateX(-${bpm / 60}px)`;
      if (frame % (200 / (bpm / 60)) == 0 && frame < frames.length) playClick();

      window.frame++;
    }

    window.addEventListener("keydown", (e) => {
      handleTap(e);
    });
  }
  return (
    <>
      <div className=" m-8 overflow-hidden flex">
        {!finished && <span className="bg-sky-700 w-4 z-20" ref={line}></span>}
        {!finished && (
          <div className="flex flex-nowrap ml-4" ref={barRef}>
            {stateRhythms.map((rhythm, index) => (
              <div
                key={index}
                className={`  text-white ${
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
        )}
        {finished && (
          <div
            className="text-4xl w-full p-6 bg-gray-300 founrded"
            style={{ height: "200px" }}
          >
            <Data />
          </div>
        )}
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
          className=" h-48 bg-gray-400 rounded "
          style={{
            cursor: "pointer",
            width: "calc(100vw - 4rem)",
            margin: "0 2rem",
          }}
          onMouseDown={handleTap}
        ></div>
      )}
    </>
  );
}
