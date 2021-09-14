import React, { useState } from "react";
import dataList, { bodyUrl } from "./dataList";

import "./assets/scss/style.scss";

function App() {
  const [dressupState, setDressupState] = useState({
    eyes: dataList.eyes[0],
    ears: dataList.ears[0],
    mouth: dataList.mouth[0],
    nose: dataList.nose[0],
    clothes: dataList.clothes[0],
  });

  function handleClick(item, new_current) {
    setDressupState({
      ...dressupState,
      [item]: new_current,
    });
  }

  function randomize() {
    const newState = {};
    Object.keys(dressupState).map(
      (item) =>
        (newState[item] =
          dataList[item][
            Math.floor(Math.random() * Math.floor(dataList[item].length))
          ])
    );
    setDressupState({
      ...dressupState,
      ...newState,
    });
  }

  return (
    <div className="App">
      <div className="row">
        <div className="col">
          <img src={bodyUrl} alt="body" id="body" />
          {Object.keys(dressupState).map((item) => (
            <div className={`${item}-container`}>
              <img
                id={item}
                src={dressupState[item].url}
                key={item}
                alt={item}
              />
            </div>
          ))}
        </div>
        <div className="col">
          <div>
            {Object.keys(dataList).map((item) => (
              <>
                <h2>{item}</h2>
                <div className="e-container">
                  {dataList[item].map((e) => (
                    <img
                      src={e.url}
                      alt={e.name}
                      className={`${item}-${e.name}`}
                      onClick={() => handleClick(item, e)}
                    />
                  ))}
                </div>
              </>
            ))}
          </div>
          <input
            type="button"
            value="RANDOMIZE"
            id="randomize"
            onClick={() => randomize()}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
