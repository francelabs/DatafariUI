import React, { useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DEBOUNCE_TIME = 250;

function RangeBarchart({
  data = [],
  xDataKey = '',
  yDataKey = '',
  startIndex,
  endIndex,
  maxHeight = '100%',
  width = '100%',
  brushStrokeColor = '#679439',
  barFillColor = '#679439AA',
  xTickFormatter,
  brushTickFormatter,
  onSelectionChanged,
}) {
  const [currentStart, setCurrentStart] = useState(startIndex);
  const [currentEnd, setCurrentEnd] = useState(endIndex);

  let timer = useRef();

  const handleRangeSelection = ({ startIndex, endIndex }) => {
    setCurrentStart(startIndex);
    setCurrentEnd(endIndex);
  };

  const handleMouseUp = () => {
    if (onSelectionChanged) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      // Add a debounce time to avoid firing event too much
      timer.current = setTimeout(() => onSelectionChanged(currentStart, currentEnd), DEBOUNCE_TIME);
    }
  };

  return (
    <div onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
      <ResponsiveContainer minHeight={maxHeight} maxHeight={maxHeight} width={width}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} tickFormatter={xTickFormatter} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush
            dataKey={xDataKey}
            height={30}
            stroke={brushStrokeColor}
            startIndex={startIndex}
            endIndex={endIndex}
            tickFormatter={brushTickFormatter} // No tooltip for the brush tool
            onChange={handleRangeSelection}
          />
          <Bar dataKey={yDataKey} fill={barFillColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RangeBarchart;
