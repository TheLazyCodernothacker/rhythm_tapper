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
  ];
  rhythms.forEach((r, i) => (r.index = i));
  let bpm = 120;
  let frames = [];
  rhythms.forEach((rhythm) => {
    for (let i = 0; i < 800 / rhythm.dur / (bpm / 60); i++) {
      frames.push([rhythm.index, i < 20 ? 1 : 0]);
    }
  });
  console.log(frames);

  const barRef = useRef(null);
  const line = useRef(null);
  let [started, setStarted] = useState(false);
  function start() {
    let frame = 0;
    setStarted(true);
    setInterval(() => {
      barRef.current.style.transform += `translateX(-${bpm / 60}px)`;
      frame++;
    }, 5);
    window.addEventListener("click", (e) => {
      if (frames[frame][1] == 1) {
        rhythms[frames[frame][0]].rest = true;
        frame++;
      }
      // let element = findElementAtPosition(
      //   line.current.getBoundingClientRect().x,
      //   line.current.getBoundingClientRect().y
      // );
      // element?.classList.add("bg-red-500");
    });
  }

  // function findElementAtPosition(x, y) {
  //   const elements = [];
  //   let element = document.elementFromPoint(x, y);

  //   while (element && element !== document.documentElement) {
  //     elements.push(element);
  //     element.style.pointerEvents = "none"; // Temporarily hide the element
  //     element = document.elementFromPoint(x, y);
  //   }

  //   // Restore pointer events
  //   elements.forEach((el) => (el.style.pointerEvents = ""));

  //   return elements.find((e) => e.classList.contains("bg-sky-600"));
  // }
  return (
    <main>
      <h1 className="text-6xl text-center m-8 font-bold text-sky-600">
        Rhythm Tappers
      </h1>
      <div className=" m-8 overflow-hidden flex">
        <span className="bg-sky-700 w-4 z-20" ref={line}></span>
        <div className="flex flex-nowrap" ref={barRef}>
          {rhythms.map((rhythm, index) => (
            <div
              key={index}
              className={`relative  text-white ${
                !rhythm.rest ? "bg-sky-600" : "bg-gray-400"
              } ${
                rhythm.compl && "bg-green-600"
              } flex items-center justify-center p-4`}
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
