import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";

import "./assets/scss/style.scss";

function toBase64(data) {
  return "data:image/png;base64," + new Buffer.from(data).toString("base64");
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
  const [dataList, setDataList] = useState({});
  const [dressupState, setDressupState] = useState({});
  const [msg, setMsg] = useState();
  const [upAva, setUpAva] = useState(false);
  const [teamName, setTeamName] = useState();
  const [teamRating, setTeamRating] = useState();
  const inputTeamName = useRef(null);

  function handleTeamName() {
    setTeamName(inputTeamName.current.value);
  }
  useEffect(() => {
    fetch("http://localhost:3003/user/avatar-data")
      .then((response) => response.json())
      .then((data) => {
        setDataList(data.message);
        setDressupState({
          bg: data.message.bg[0],
          helement: data.message.helement[0],
          logo: data.message.logo[0],
          city: data.message.city[0],
          tck: data.message.tck[0],
        });
      });
    setTeamRating(randomIntFromInterval(10, 99));
    setTeamName("Team Name");
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

    setTeamRating(randomIntFromInterval(10, 99));
    setTeamName("Team Name");
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
          formdata.append("userName", "t2");
          formdata.append("img", canvasBlob);
          formdata.append("bg", dressupState.bg.id);
          formdata.append("helement", dressupState.helement.id);
          formdata.append("logo", dressupState.logo.id);
          formdata.append("city", dressupState.city.id);
          formdata.append("tck", dressupState.tck.id);
          formdata.append("teamName", teamName);
          formdata.append("teamRating", teamRating);

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
        console.log(data);
        const getAvatarData = {};
        Object.keys(dataList).map((x) => {
          if (x === "teamName") return;
          if (x === "teamRating") return;
          const list = dataList[x].find((e) => e.id === data.data[x]);
          getAvatarData[x] = list;
        });
        setDressupState(getAvatarData);
        setTeamName(data.data.teamName);
        setTeamRating(data.data.teamRating);
        setMsg("user name: " + " " + data.data.userName);
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
          formdata.append("bg", dressupState.bg.id);
          formdata.append("helement", dressupState.helement.id);
          formdata.append("logo", dressupState.logo.id);
          formdata.append("city", dressupState.city.id);
          formdata.append("tck", dressupState.tck.id);
          formdata.append("teamName", teamName);
          formdata.append("teamRating", teamRating);

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
          {/* <img
            src={dataList.body && toBase64(dataList.body[0].url.data)}
            alt="body"
            id="body"
          /> */}
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
          <h1 id="teamName">{teamName}</h1>
          <h1 id="teamRating">{teamRating}</h1>
        </div>
        <div className="col">
          <div>
            {Object.keys(dataList).map((item) => {
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
          <div className="buttons">
            <label htmlFor="teamName">Enter Team name</label>
            <input
              type="text"
              value={teamName}
              ref={inputTeamName}
              onChange={handleTeamName}
            />
            <br />
            <button id="randomize" onClick={() => randomize()}>
              randomize
            </button>
            {!upAva && <button onClick={saveAvatar}>Save Avatar</button>}
            <button onClick={getAvatar}>Get Avatar</button>
            {upAva && <button onClick={updateAvatar}>Update Avatar</button>}
            {msg && <h2>{msg}</h2>}
          </div>
        </div>
      </div>
      {/* <div id="imagePpreview">
        <h2>image Ppreview</h2>
      </div> */}
    </div>
  );
}

export default App;
