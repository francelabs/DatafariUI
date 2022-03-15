import React from 'react';
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
  tickFormatter,
  onSelectionChanged,
}) {
  const handleRangeSelection = ({ startIndex, endIndex }) => {
    onSelectionChanged && onSelectionChanged(startIndex, endIndex);
  };

  return (
    <ResponsiveContainer
      minHeight={maxHeight}
      maxHeight={maxHeight}
      width={width}
    >
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} tickFormatter={tickFormatter} />
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
          onChange={handleRangeSelection}
        />
        <Bar dataKey={yDataKey} fill={barFillColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RangeBarchart;
