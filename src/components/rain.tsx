import { useState } from "react";
// ? TYPES:
import { RainInfo } from "@/types/weather";

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

interface DropSettings {
  [key: string]: React.CSSProperties;
}

function generateDrops(info: RainInfo) {
  const drops: DropSettings[] = [];
  let increment = 0;
  while (increment < 100) {
    const randoHundo = randomNumber(1, 98);
    const randoDuration = randomNumber(60, 120) / 100;
    increment += randomNumber(100 / info.probability, 400 / info.probability);
    if (increment > 100) {
      break;
    }
    const output: DropSettings = {
      drop: {
        left: `${increment}%`,
        bottom: randomNumber(3, 8) + "%",
        animationDelay: `0.${randoHundo}s`,
        animationDuration: `${randoDuration}s`
      },
      stem: {
        animationDelay: `0.${randoHundo}s`,
        animationDuration: `0.5${randoHundo}s`
      },
      splat: {
        animationDelay: `0.${randoHundo}s`,
        animationDuration: `0.5${randoHundo}s`
      }
    };
    drops.push(output);
  }
  return drops;
}
export const Rain: React.FC<{ info: RainInfo; splatEnabled?: boolean; }> = ({ info, splatEnabled }) => {
  const [drops] = useState(() => generateDrops(info));

  return <div className="rain">
    {drops.map((item, i) =>
      <div key={i} className="drop" style={item.drop}>
        <div className="stem" style={item.stem}></div>
        {splatEnabled && <div className="splat" style={item.splat}></div>}
      </div>)}
  </div>;
};