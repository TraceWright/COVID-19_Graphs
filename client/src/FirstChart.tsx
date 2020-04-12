import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { scaleLinear } from "d3-scale";

// function RandomData() {
//     return [{
//         "_id": 1,
//         "notification_date": "2020-01-22T00:00:00",
//         "postcode": 2134,
//         "lhd_2010_code": "X700",
//         "lhd_2010_name": "Sydney",
//         "lga_code19": 11300,
//         "lga_name19": "Burwood (A)",
//     }];
//   }


function RandomData() {
  const data = [...Array(100)].map((e, i) => {
    return {
      x: Math.random() * 40,
      y: Math.random() * 40,
      temparature: Math.random() * 500
    };
  });
  return data;
}

export function FirstChart() {
  const [data, setData] = useState(RandomData());
  const [open, toggle] = useState(false);
  const props = useSpring({
    from: { r: 0, fill: "lightblue" },
    to: { r: open ? 10 : 5, fill: open ? "purple" : "lightblue" }
  }) as any;

  const w = 600, h = 600, margin = {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40
  };

  const width = w - margin.right - margin.left,
    height = h - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, 40]) // [lowest element, highest element]
    .range([0, width]); // [0, width]

  const yScale = scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

  function handleClick(e: any) {
    setData(RandomData());
    if (open) {
      toggle(false);
    } else {
      toggle(true);
    }
  }

  const circles = data.map((d, i) => (
    <animated.circle
      key={i}
      r={props.r}
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      style={{ fill: props.fill }}
    />
  ));

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <svg width={w} height={h}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisLeft yScale={yScale} width={width} />
          <AxisBottom xScale={xScale} height={height} />
          {circles}
        </g>
      </svg>
    </div>
  );
}

function AxisLeft({ yScale, width }: any) {
 const textPadding = -20

  const axis = yScale.ticks(5).map((d: React.ReactNode, i: string | number | undefined) => (
    <g key={i} className="y-tick">
      <line
        style={{ stroke: "#e4e5eb" }}
        y1={yScale(d)}
        y2={yScale(d)}
        x1={0}
        x2={width}
      />
      <text
        style={{ fontSize: 12 }}
        x={textPadding}
        dy=".32em"
        y={yScale(d)}
      >
        {d}
      </text>
    </g>
  ));
  return <>{axis}</>;
}

function AxisBottom({ xScale, height }: any) {
  const textPadding = 10;

  const axis = xScale.ticks(10).map((d: React.ReactNode, i: string | number | undefined) => (
    <g className="x-tick" key={i}>
      <line
        style={{ stroke: "#e4e5eb" }}
        y1={0}
        y2={height}
        x1={xScale(d)}
        x2={xScale(d)}
      />
      <text
        style={{ textAnchor: "middle", fontSize: 12 }}
        dy=".71em"
        x={xScale(d)}
        y={height + textPadding}
      >
        {d}
      </text>
    </g>
  ));
  return <>{axis}</>;
}

export default FirstChart;
