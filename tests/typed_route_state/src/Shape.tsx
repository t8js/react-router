import { getRandomShape } from "./getRandomShape.ts";

export type ShapeProps = {
  n: number;
  x?: number;
  y?: number;
  r?: number;
};

export const Shape = ({ n, x = 50, y = 50, r = 30 }: ShapeProps) => {
  return (
    <div className="shape">
      <svg viewBox="0 0 100 100" height="240">
        <title>Shape {n}</title>
        <circle
          data-id="circum"
          cx={x}
          cy={y}
          r={r}
          fill="none"
          stroke="black"
          strokeWidth=".5"
          strokeOpacity=".2"
          strokeDasharray="1 2"
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
