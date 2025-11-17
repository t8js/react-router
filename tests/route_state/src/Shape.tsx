import { getRandomShape } from "./getRandomShape.ts";
import { toNumber } from "./toNumber.ts";

const n = 10;

export type ShapeProps = {
  x?: number | string;
  y?: number | string;
  r?: number | string;
};

export const Shape = (props: ShapeProps) => {
  let x = toNumber(props.x, 50);
  let y = toNumber(props.y, 50);
  let r = toNumber(props.r, 30);

  return (
    <div className="shape">
      <svg viewBox="0 0 100 100" height="240">
        <title>Shape</title>
        <circle
          data-id="circum"
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke="black"
          strokeWidth=".5"
          strokeOpacity=".1"
        />
        <path
          d={getRandomShape(n, x, y, r)}
          stroke="currentColor"
          fill="currentColor"
          fillOpacity=".3"
        />
        <circle cx={x} cy={y} r="1.5" fill="red" stroke="none" />
      </svg>
    </div>
  );
};
