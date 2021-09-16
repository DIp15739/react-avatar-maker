import html2canvas from "html2canvas";
import React, { useEffect, useState } from "react";

import "./assets/scss/style.scss";

function toBase64(data) {
  return "data:image/png;base64," + new Buffer.from(data).toString("base64");
}

function App() {
  const [dataList, setDataList] = useState({});
  const [dressupState, setDressupState] = useState({});
  const [msg, setMsg] = useState();
  const [upAva, setUpAva] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3003/user/avatar-data")
      .then((response) => response.json())
      .then((data) => {
        setDataList(data.message);
        setDressupState({
          eyes: data.message.eyes[0],
          ears: data.message.ears[0],
          mouth: data.message.mouth[0],
          nose: data.message.nose[0],
          clothes: data.message.clothes[0],
        });
      });
  }, []);

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

  async function saveAvatar() {
    //html to canvas
    await html2canvas(document.querySelector("#captureAvatar")).then(
      (canvas) => {
        // let imagePpreview = document.querySelector("#imagePpreview");
        // imagePpreview.appendChild(canvas);

        // canvas to blob
        canvas.toBlob((canvasBlob) => {
          //add blob in db

          const formdata = new FormData();
          formdata.append("userName", "t1");
          formdata.append("img", canvasBlob);
          formdata.append("eyes", dressupState.eyes.id);
          formdata.append("ears", dressupState.ears.id);
          formdata.append("mouth", dressupState.mouth.id);
          formdata.append("nose", dressupState.nose.id);
          formdata.append("clothes", dressupState.clothes.id);

          fetch("http://localhost:3003/user/create-avatar", {
            method: "POST",
            body: formdata,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) setMsg(data.error);
              if (data.message) setMsg(data.message);
              setTimeout(() => {
                setMsg("");
              }, 4000);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
  }

  async function getAvatar() {
    const username = "t1";
    await fetch(`http://localhost:3003/user/get-avatar/${username}`)
      .then((response) => response.json())
      .then((data) => {
        const getAvatarData = {};
        Object.keys(dataList).map((x) => {
          if (x === "body") return;
          const list = dataList[x].find((e) => e.id === data.data[x]);
          getAvatarData[x] = list;
        });
        setDressupState(getAvatarData);
        setUpAva(true);
      });
  }

  async function updateAvatar() {
    //html to canvas
    await html2canvas(document.querySelector("#captureAvatar")).then(
      (canvas) => {
        // let imagePpreview = document.querySelector("#imagePpreview");
        // imagePpreview.appendChild(canvas);

        // canvas to blob
        canvas.toBlob((canvasBlob) => {
          //add blob in db
          const formdata = new FormData();
          formdata.append("userName", "t1");
          formdata.append("img", canvasBlob);
          formdata.append("eyes", dressupState.eyes.id);
          formdata.append("ears", dressupState.ears.id);
          formdata.append("mouth", dressupState.mouth.id);
          formdata.append("nose", dressupState.nose.id);
          formdata.append("clothes", dressupState.clothes.id);

          fetch("http://localhost:3003/user/update-avatar", {
            method: "POST",
            body: formdata,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) setMsg(data.error);
              if (data.message) setMsg(data.message);
              setTimeout(() => {
                setMsg("");
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    );
    setUpAva(false);
  }

  return (
    <div className="App">
      <div className="row">
        <div className="col" id="captureAvatar">
          <img
            src={dataList.body && toBase64(dataList.body[0].url.data)}
            alt="body"
            id="body"
          />
          {Object.keys(dressupState).map((item) => (
            <div className={`${item}-container`}>
              <img
                id={item}
                src={toBase64(dressupState[item].url.data)}
                key={item}
                alt={item}
              />
            </div>
          ))}
        </div>
        <div className="col">
          <div>
            {Object.keys(dataList).map((item) => {
              if (item === "body") return;
              return (
                <>
                  <h2>{item}</h2>
                  <div className="e-container">
                    {dataList[item].map((e) => (
                      <img
                        src={toBase64(e.url.data)}
                        alt={e.name}
                        className={`${item}-${e.name}`}
                        onClick={() => handleClick(item, e)}
                      />
                    ))}
                  </div>
                </>
              );
            })}
          </div>
          <input
            type="button"
            value="RANDOMIZE"
            id="randomize"
            onClick={() => randomize()}
          />
          {!upAva && <button onClick={saveAvatar}>Save Avatar</button>}
          <button onClick={getAvatar}>Get Avatar</button>
          {upAva && <button onClick={updateAvatar}>Update Avatar</button>}
          {msg && <h2>{msg}</h2>}
        </div>
      </div>
      {/* <div id="imagePpreview">
        <h2>image Ppreview</h2>
      </div> */}
    </div>
  );
}

export default App;
