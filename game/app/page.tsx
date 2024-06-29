"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Bar from "../components/Bar";

export default function Home() {
  const [bpm, setBpm] = useState(80);
  const [POE, setPOE] = useState(20);

  return (
    <main>
      <h1 className="text-6xl text-center m-8 font-bold text-sky-600">
        Rhythm Tappers
      </h1>
      <Bar
        rhythms={[
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
          { dur: 4, rest: false, compl: false },
          { dur: 4, rest: false, compl: false },
          { dur: 4, rest: false, compl: false },
          { dur: 4, rest: false, compl: false },
        ]}
        POE={POE}
        bpm={bpm}
      />
    </main>
  );
}
