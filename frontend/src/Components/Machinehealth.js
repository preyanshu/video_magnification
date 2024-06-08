import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogViewer from './LogsViewer';
import io from 'socket.io-client';

const MachineHealth = () => {
  var option = "";
  const [mag, setMag] = useState(10);
  const ref = useRef();
  const ref2 = useRef();
  const [src, setSrc] = useState(null);
  const [q, setQ] = useState(1);
  const [msrc, setMsrc] = useState(null);
  const [updone, setUpdone] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("0");

  const handleSelectChange = (event) => {
    console.log(selectedOption);
    setSelectedOption(event.target.value);
  };

  const fetchData = async (url, technique, mode) => {
    try {
      console.log(url, technique, mode);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/magnify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          url: url,
          technique: technique,
          mode: mode
        })
      });

      if (!response.ok) {
        alert('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setMsrc(data.video_url);
    } catch (error) {
      alert('Error fetching data');
    }
  };

  useEffect(() => {
    ref.current = window.cloudinary;
    ref2.current = ref.current.createUploadWidget(
      {
        cloudName: 'dbo7hzofg',
        uploadPreset: 'jq6uk0l9',
        sources: ['local', 'google_drive'],
        multiple: false,
        clientAllowedFormats: ['video'],
        maxVideoFileSize: 200000000,
        theme: 'dark',
        transformation: {
          delay: "100"
        },
      },
      function (e, r) {
        if (r.event === 'success') {
          console.log(r.info);
          setUpdone(true);
          setSrc(r.info.url);
          option = localStorage.getItem("option");
          console.log(option);
          if (option === "0") {
            fetchData(r.info.url, "phase", "");
          } else if (option === "1") {
            fetchData(r.info.url, "eulerian", "1");
          } else if (option === "2") {
            fetchData(r.info.url, "eulerian", "0");
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, {
      extraHeaders: {
        'ngrok-skip-browser-warning': '69420'
      }
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('messages', (message) => {
      console.log('Received message:', message);
      setLogs(prevLogs => [...prevLogs, message]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dynamicStyles = {
    backgroundColor: "#2F2F2F",
    width: collapse ? "96vw" : "84vw",
    border: "0px solid black",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    minHeight: "130vh",
    justifyContent: loading || report ? "center" : "",
    paddingBottom: "30px",
    height: "160vh",
    transition: "0.3s"
  };

  const dynamicStyles2 = {
    height: "160vh",
    width: collapse ? "4vw" : "16vw",
    transition: "0.3s",
    backgroundColor: "black",
    borderRight: "1px solid white",
  };

  function convertToJpg(fileName) {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    const newFileName = `${fileNameWithoutExtension}.jpg`;
    return newFileName;
  }

  return (
    <>
      <div className="d-flex">
        <div className="sidebar" style={dynamicStyles2}>
          {collapse && 
            <i className="fa-solid fa-arrow-right me-3 fa-2xl arrow" style={{color:"white",position:"absolute",right:"10px",top:"28px",backgroundColor:"",cursor:"pointer",zIndex:"+100"}} 
              onClick={() => {
                console.log("clicked");
                setCollapse(!collapse);
              }}>
            </i>
          }
          {!collapse && 
            <i className="fa-solid fa-arrow-left me-3 fa-2xl arrow" style={{color:"white",position:"absolute",right:"10px",top:"28px",backgroundColor:"",cursor:"pointer",zIndex:"+100"}} 
              onClick={() => {
                console.log("clicked");
                setCollapse(!collapse);
              }}>
            </i>
          }
          {!collapse && 
            <>
              <lottie-player src="https://lottie.host/2ee7d6ca-1b37-42ea-9f95-dd27434da0b4/I02QrsEa3F.json" background="##FFFFFF" speed="1" style={{width: "240px", height: "240px"}} loop autoplay direction="1" mode="normal"></lottie-player>
              <span style={{color:"white",fontSize:"30px",fontWeight:"900",marginTop:"-35px"}}>Hi, there.</span>
            </>
          }
          {collapse && 
            <>
              <br /> <br /> <br /><br /><br /><br /><br /><br />
            </>
          }
          <hr />
          {!collapse &&
            <>
              <div className="p mt-3 " style={{backgroundColor:"white",color:"black"}} onClick={() => navigate("/machinehealth")}><i className="fa-solid fa-screwdriver-wrench me-3"></i>Machine</div>
            </>
          }
          {collapse && 
            <>
              <div className="p mt-3" style={{backgroundColor:"white",color:"black"}} onClick={() => navigate("/machinehealth")} ><i className="fa-solid fa-screwdriver-wrench me-3 " style={{marginLeft:"-5px"}}></i></div>
            </>
          }
        </div>
        
        <div style={dynamicStyles}>
          {!msrc && !src && 
            <div className="mb-3 shadow" style={{backgroundColor:"black",height:"25vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",marginTop:"80px",color:"white",borderRadius:"5px"}}>
              <div className='machinetitle'>
                <h1 style={{fontWeight:"800",fontSize:"3rem",color:"white"}}>
                  <i className="fa-solid fa-screwdriver-wrench fa-5xl me-3"></i>
                  Magnify Video
                </h1>
              </div>
              <div className='mt-2'>
                <span style={{fontSize:"1.18rem "}}>
                  Access Your Health Report Online
                </span>
              </div>
            </div>
          }
          {!src && !updone && 
            <>
              <div className="my-5 shadow" style={{backgroundColor:"black",height:"35vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",borderRadius:"5px"}}>
                <div style={{backgroundColor:"#CFE2FF",height:"75%",width:"90%",border:"0px solid black",display:"flex",justifyContent:"center",flexDirection:"column",border:"2px dotted white",borderRadius:10+"px",alignItems:"center"}}>
                  <button className="btn mt-5 btn-primary p-3 px-5 uploadbtn" onClick={() => {
                    localStorage.setItem("option", selectedOption);
                    ref2.current.open();
                  }}>
                    <h3><i className="fa-solid fa-upload fa-lg me-3"></i>Upload Video</h3>
                  </button>
                  <h5 className="mt-3" style={{fontSize:"19px"}}>
                    Maximum 200MB file size limit.
                  </h5>
                </div>
              </div>
              <div className="mb-5 shadow" style={{backgroundColor:"black",height:"30vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",borderRadius:"5px"}}>
                <div className="d-flex justify-content-center align-items-center">
                  <h5 style={{fontSize:"1.45rem",color:"white"}}>Select a Technique</h5>
                </div>
                <div className="mt-3 w-25" style={{backgroundColor:"white",borderRadius:"5px",border:"1px solid black"}}>
                  <select className="form-select form-select-lg" value={selectedOption} onChange={handleSelectChange}>
                    <option value="0">Phase-Based Magnification</option>
                    <option value="1">Eulerian Motion Magnification (Color)</option>
                    <option value="2">Eulerian Motion Magnification (Intensified)</option>
                  </select>
                </div>
              </div>
            </>
          }
          {src && !updone && 
            <div className="loader" style={{marginTop:"200px"}}>
              <h1>Loading ...</h1>
            </div>
          }
          {msrc && src && 
            <>
              <div className="machinetitle shadow" style={{backgroundColor:"black",height:"35vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",color:"white",borderRadius:"5px"}}>
                <h1 style={{fontWeight:"800",fontSize:"3rem",color:"white"}}>
                  <i className="fa-solid fa-file-waveform fa-5xl me-3"></i>
                  Magnified Video
                </h1>
                <div className='mt-2'>
                  <span style={{fontSize:"1.18rem "}}>
                    View Magnified Results Online
                  </span>
                </div>
              </div>
              <div className="mt-4 mb-5 shadow" style={{backgroundColor:"black",height:"70vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",borderRadius:"5px"}}>
                <video src={msrc} style={{height:"100%",width:"100%",objectFit:"contain"}} controls></video>
              </div>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default MachineHealth;
