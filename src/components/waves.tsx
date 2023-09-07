import WaveSVG from "../assets/wave.svg";

const max = 6;
const min = 0.3;

export const Waves: React.FC<{ intensity: number; }> = ({ intensity }) => {
  const aboveMaxOrBelowMinValue = intensity >= max ? 1 : intensity <= min ? 0.05 : 0;
  const scaleY = aboveMaxOrBelowMinValue > 0 ? aboveMaxOrBelowMinValue : intensity * (1 / max);
  return <div className="waves" style={{ transform: `scale(1, ${scaleY})` }}>
    <div className="wave wave--back">
      <div className="water"><WaveSVG /></div>
      <div className="water"><WaveSVG /></div>
    </div>
    <div className="wave wave--front">
      <div className="water"><WaveSVG /></div>
      <div className="water"><WaveSVG /></div>
    </div>
  </div>
}