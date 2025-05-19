import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './App.css';
import Plotly from "plotly.js";
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

function App() {
  const [data, setData] = useState({ dx: [], dy: [], time: [] });
  const [options, setOptions] = useState({
    alpha: 0.1,
    beta: 0.002,
    gamma: 0.2,
    delta: 0.0025,
    start_X: 80,
    start_Y: 20,
    time: 100,
  });

  const splitOptions = {
    alpha: 100,
    beta: 10000,
    gamma: 100,
    delta: 10000,
    start_X: 1,
    start_Y: 1,
    time: 1,
  };

  const LodkaValterraFunc = ({ x, y, alpha, beta, gamma, delta }) => {
    const dx_dt = (alpha - beta * y) * x;
    const dy_dt = (-gamma + delta * x) * y;
    return [dx_dt, dy_dt];
  };

  useEffect(() => {
    const payload = { dx: [], dy: [], time: [] };
    let x = options.start_X;
    let y = options.start_Y;

    for (let i = 0; i < options.time; i++) {
      payload.dx.push(x);
      payload.dy.push(y);
      payload.time.push(i);
      const [dx, dy] = LodkaValterraFunc({ x, y, ...options });
      x += dx;
      y += dy;
    }
    setData(payload);
  }, [options]);

  return (
    <div className="App">
      <div className="title">
        <h1>Модель Лотки-Вольтерры</h1>
        <div className="btns">
          {Object.keys(options).map((param) => (
            <div className="btns_item" key={param}>
              <div style={{ minWidth: '60px' }}>{param}:</div>
              <Slider
                value={options[param] * splitOptions[param]}
                onChange={(data) => {
                  setOptions(prev => ({ ...prev, [param]: data / splitOptions[param] }));
                }}
                min={param === 'time' ? 10 : 0}
                max={param === 'time' ? 200 : 100}
              />
              <div style={{ minWidth: '60px' }}>{options[param].toFixed(3)}</div>
            </div>
          ))}
        </div>
        <div className="desc">
          Соколов П. ИВТ 3 курс
        </div>
      </div>
      <div className="graphics">
        <div className="plot-container">
          <Plot
            data={[
              {
                x: data.time,
                y: data.dx,
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'blue' },
                name: "Популяция жертв"
              },
              {
                x: data.time,
                y: data.dy,
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                name: "Популяция хищников"
              },
            ]}
            layout={{ width: 600, height: 400, title: 'График зависимости популяций друг от друга.' }}
          />
        </div>
        <div className="plot-container">
          <Plot
            data={[
              {
                x: data.dx,
                y: data.dy,
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'purple' },
                name: "Фазовый портрет"
              },
            ]}
            layout={{ width: 600, height: 400, title: 'Фазовый портрет.' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;