import React from 'react'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import rawData from './data.json';

export interface Consumes {
  CodigoDispositivo: string;
  Medicoes: Medicoes[];
}

export interface Medicoes {
  DataConsumo: string;
  QtdConsumo: number;
}

type LineChartData = {
  DataConsumo: number;
} & {
  [CodigoDispositivo: string]: number | null;
}

type ConsumesToLineChartData = {
  data: LineChartData[],
  devices: string[],
}

const consumesToLineChartData = (consumes: Consumes[]): ConsumesToLineChartData => {
  const devices = consumes.map(consume => consume.CodigoDispositivo);

  const dates = consumes
    .reduce((acc, consume) => {
      consume.Medicoes.forEach(medicao => {
        const time = new Date(medicao.DataConsumo).getTime();
        if (!acc.includes(time)) {
          acc.push(time);
        }
      });

      return acc;
    }, [] as number[])
    .sort();

  const data = dates.map(date => {
    const obj = {
      DataConsumo: date,
    } as LineChartData;

    consumes.forEach(consume => {
      consume.Medicoes.forEach(medicao => {
        const time = new Date(medicao.DataConsumo).getTime();
        if (time === date) {
          obj[consume.CodigoDispositivo] = medicao.QtdConsumo;
        }
      });
    });

    return obj;
  });

  return { data, devices }
}

const { data, devices } = consumesToLineChartData(rawData.Consumos)

const colorMap = [
  "#36bc96",
  "#153764",
  "#730000",
  "#888202",
  "#14d2aa",
  "#215aa4",
  "#bf0000",
  "#e2d903",
  "#49ffd9",
  "#0ab9ff",
  "#d96666",
  "#eee868"
]

const App: React.FC = () => {

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="DataConsumo"
            type='number'
            domain={['auto', 'auto']}
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
          />
          <YAxis
            type='number'
            domain={['auto', 'auto']}
          />
          <Tooltip
            labelFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
          />
          <Legend />
          {devices.map((device, index) => (
            <Line
              type="monotone"
              dataKey={device}
              stroke={colorMap[index % colorMap.length]}
              strokeWidth={1.5}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default App
