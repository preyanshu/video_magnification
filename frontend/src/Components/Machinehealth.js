import React,{useState,useRef,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import LogViewer from './LogsViewer';
import io from 'socket.io-client';

const Machinehealth = () => {
    var option="";
    const [mag,setmag]=useState(10);
    const ref = useRef();
  const ref2 = useRef();
  const [src,setsrc]=useState(null);
  const [q,setq]=useState(1);
  const[msrc,setmsrc]=useState(null);
  const [updone,setupdone]=useState(null);
  const[report,setreport]=useState(null);
  const[loading,setloading]=useState(false);
  const[collapse,setcollapse]=useState(false);
  const[logs,setLogs]=useState([

  ]);
  const navigate=useNavigate();
  const [selectedOption, setSelectedOption] = useState("0");

  const handleSelectChange = (event) => {
    // console.log(event.target.value);
    console.log(selectedOption);
    setSelectedOption(event.target.value);
  };
 

  const fetchData = async (url,technique,mode) => {
    try {
      // option=localStorage.getItem("option");
      
      
      // if(option=="0"){
      //   var technique="phase";
        

      // }
      // else if(option=="1"){
      //   var technique="eulerian"
      //   var mode="1";
      // }
      // else if(option=="2"){
      //   var technique="eulerian"
      //   var mode="0";
      // }
      console.log(url,technique,mode);
      const response = await fetch('https://ad0b00ef-3f00-4cb3-acce-aa6c28cbd862-00-xykag7b1y2nk.picard.replit.dev:5000/magnify', {
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
      setmsrc(data.
        video_url);
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
        // showCompletedButton: true,
        // Adding video transformation for compression
        // Adjust quality, width, height, and other parameters as needed
        // Example: Compressing video by reducing quality to 50% and resizing to 720p
        transformation: {
         
          delay: "100"
          // Add other transformation options as needed
        },
      },
      function (e, r) {
        if (r.event === 'success') {

          console.log(r.info);
         
          setupdone(true);
          setsrc(r.info.url);
          option=localStorage.getItem("option");
          console.log(option);
          if(option=="0"){
            fetchData(r.info.url,"phase","");
          }
          else if(option=="1"){
            fetchData(r.info.url,"eulerian","1");
          }
          else if(option=="2"){
            fetchData(r.info.url,"eulerian","0");
          }


          
        }
      }
    );
  }, []);

  useEffect(() => {
    const socket = io('https://d9f0-2409-40d7-7-598-e4d1-9e10-abe6-878e.ngrok-free.app', {
  extraHeaders: {
    'ngrok-skip-browser-warning': '69420'
  }
});
// Assuming your Socket.IO server is running locally on port 5001

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('messages', (message) => {
      console.log('Received message:', message); // Log the received message
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
  height: "",
  width: collapse? "96vw" : "84vw",
  border: "0px solid black",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "20px",
  minHeight: loading||report ? "100vh" : "130vh",
  justifyContent: loading||report ? "center" : "",
  paddingBottom: "30px",
  // minHeight: "120vh",
  transition:"0.3s"
};
const dynamicStyles2 = {

  Height: loading||report ? "100vh" : "130vh",
  width: collapse? "4vw" : "16vw",
  transition:"0.3s",
  backgroundColor:"black",
  borderRight:"1px solid white",

  
};

function convertToJpg(fileName) {
  // Extract the file name without the extension
  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  // Append '.jpg' extension to the file name
  const newFileName = `${fileNameWithoutExtension}.jpg`;

  return newFileName;
}

  return (<>

  <div className="d-flex">
    

  <div class="sidebar" style={dynamicStyles2}>

    {collapse && 
  <i class="fa-solid fa-arrow-right me-3 fa-2xl arrow"  style={{color:"white",position:"absolute",right:"10px",top:"28px",backgroundColor:"",cursor:"pointer",zIndex:"+100"}} onClick={()=>{
     console.log("clicked");
      if(collapse){
        setcollapse(false);
      }
      else{
        setcollapse(true);
      }
    
  }}></i>
   }
    {!collapse && 
  <i class="fa-solid fa-arrow-left me-3 fa-2xl arrow" style={{color:"white",position:"absolute",right:"10px",top:"28px",backgroundColor:"",cursor:"pointer",zIndex:"+100"}}  onClick={()=>{
    console.log("clicked");
      if(collapse){
        setcollapse(false);
      }
      else{
        setcollapse(true);
      }
    
  }}></i>
  }
    
{!collapse && <>
  <lottie-player src="https://lottie.host/2ee7d6ca-1b37-42ea-9f95-dd27434da0b4/I02QrsEa3F.json" background="##FFFFFF" speed="1" style={{width: "240px", height: "240px"}} loop  autoplay direction="1" mode="normal"></lottie-player>
  <span style={{color:"white",fontSize:"30px",fontWeight:"900",marginTop:"-35px"}}>
  Hi,there.
  </span>
</>}
{collapse && <>
<br /> <br /> <br /><br /><br /><br /><br /><br />
</>}
 

  <hr />
  {!collapse &&<>
    <div className="p mt-3" style={{backgroundColor:"white",color:"black"}} onClick={()=>{
      navigate("/machinehealth")
    }}><i class="fa-solid fa-screwdriver-wrench me-3"></i>Machine Health</div>
   {/* <div className="p"><i class="fa-solid fa-notes-medical me-3"></i>Human Health</div> */}
   <div className="p" onClick={()=>{
    navigate("/feedback");
   }}><i class="fa-solid fa-message me-3" ></i>Feedback</div>
   <div className="p" onClick={()=>{
    navigate("/support");
   }}><i class="fa-solid fa-circle-question me-3" ></i>Support</div>
   <div className="p" onClick={()=>{
    navigate("/termsandpolicy");
   }}><i class="fa-solid fa-file-contract me-3" ></i>Terms & Policy</div>
   <div className="btn btn-danger my-5" style={{height:"50px",width:"70%",fontSize:"20px",display:"flex",justifyContent:"center",alignItems:"center"}} onClick={()=>{
    navigate("/")
   }}><i class="fa-solid fa-right-from-bracket me-3"></i>Logout</div>
  
  </> }
  {collapse &&<>
    <div className="p mt-3" style={{backgroundColor:"white",color:"black"}} onClick={()=>{
      navigate("/machinehealth")
    }} ><i class="fa-solid fa-screwdriver-wrench "></i></div>
   {/* <div className="p"><i class="fa-solid fa-notes-medical me-3"></i>Human Health</div> */}
   <div className="p" onClick={()=>{
      navigate("/feedback")
    }}><i class="fa-solid fa-message "></i></div>
   <div className="p" onClick={()=>{
      navigate("/support")
    }}><i class="fa-solid fa-circle-question "></i></div>
   <div className="p" onClick={()=>{
      navigate("/termsandpolicy")
    }}><i class="fa-solid fa-file-contract "></i></div>
   <div className="btn btn-danger my-5" style={{height:"50px",width:"70%",fontSize:"20px",display:"flex",justifyContent:"center",alignItems:"center"}} onClick={()=>{
      navigate("/")
    }}><i class="fa-solid fa-right-from-bracket "></i></div>
  
  </> }
   


  </div>
  
    <div style={dynamicStyles}>
       {!msrc && !src &&  <div  className=" mb-3 shadow" style={{backgroundColor:"black",height:"25vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",marginTop:"80px",color:"white",borderRadius:"5px"}}>
            <div className='machinetitle'>
            <h1 style={{fontWeight:"800",fontSize:"3rem",color:"white"}}>
            <i class="fa-solid fa-screwdriver-wrench fa-5xl me-3"></i>
            Maginify Video
            </h1>
            </div>
            <div className='mt-2'>
            <span style={{fontSize:"1.18rem "}}>
            Access Your Health Report Online
            </span>
            </div>

        </div>}
{!src && !updone && <>
        <div  className="my-5  shadow" style={{backgroundColor:"black",height:"35vh",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",borderRadius
      :"5px"}}>
            <div style={{backgroundColor:"#CFE2FF",height:"75%",width:"90%",border:"0px solid black",display:"flex",justifyContent:"center",flexDirection:"column",border:"2px dotted white",borderRadius:10+"px",alignItems:"center"}}>
                <button className="btn mt-5 btn-primary p-3 px-5 uploadbtn" onClick={()=>{
                  localStorage.setItem("option",selectedOption);
                  ref2.current.open();
                }}><h3><i class="fa-solid fa-upload fa-lg me-3"></i>Upload Video</h3></button>
                <h5  className="mt-3"style={{fontSize:"19px"}}>

                Maximum 200MB file size limit.</h5>
            </div>

        </div>
        <div  className="mb-3" style={{backgroundColor:"",height:"fit-content",width:"50vw",border:"0px solid black",display:"flex",justifyContent:"center",flexDirection:"column",position:"relative",minHeight:20+"vh"}}>
        <div class="accordion accordion-flush" id="accordionExample">
  <div class="accordion-item shadow" style={{position:"absolute",top:"0px",width:"100%",borderRadius:"0px"}}>
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" style={{borderRadius:"5px"}}>
      <i class="fa-solid me-3 fa-gear fa-lg"></i><b> Advanced Settings  (Optional)</b>
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body " style={{border:"1px solid white",height:"fit-content",minHeight:"19vh",backgroundColor:"black",color:"white",borderRadius:"5px"}}>
      <div className="d-flex">
        <h5 style={{width:30+"%",marginTop:"9px",fontSize:"18px"}}>Magnification Method :</h5>
        <div>

        <select className="form-select" aria-label="Default select example" value={selectedOption} onChange={handleSelectChange}>
      <option value="0">Phase Magnification</option>
      <option value="1">Eularian Method (color)</option>
      <option value="2">Eularian Method (vibration)</option>
      {/* <option value="1">Eularian Method</option> */}
    </select>

<div className='p-3'>

<b>Eulerian Method: </b>Offers superior results but requires more processing time. <br />
<b>Phase Magnification: </b>
 Provides good results with significantly less processing time compared to Eulerian method.

</div>
</div>




      </div>
      <div className="d-flex" >
        <h5 style={{width:30+"%",marginTop:"15px",fontSize:"18px",marginLeft:""}}>Magnification Factor :</h5>
        

        {/* <label for="customRange3" class="form-label">Example range</label> */}
        <div style={{border:"0px solid black"}}>
            <div className='d-flex' style={{border:"0px solid black",width:"100%"}}>
       
        
<input type="range" class="form-range mt-3 me-3" min="0" max="20" step="0.5" id="customRange3"value={mag} onChange={(e)=>{
    console.log(e.target.value);
    setmag(e.target.value);
}} style={{marginLeft:"-6%"}}/>
 
            <h5 style={{marginTop:"13px"}}>{mag} </h5>
            </div>
            
<div className='p-3' style={{marginLeft:"-8%"}}>

<b>Higher Factor: </b>Offers more pronounced magnification with increased processing time. <br />
<b>Lower Factor: </b>Provides adequate magnification with reduced processing time 


</div>
        

        </div>
       







      </div>
      
       
      </div>
    </div>
  </div>
  
 
</div>


        </div></>}
    {
       !report && !loading && !msrc && updone && <>

       <div style={{height:"50px"}}>

       </div>
      <div className="my-3  shadow" style={{backgroundColor:"black",minheight:"50vh",width:"50vw",border:"wpx solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",height:"fit-content",borderRadius:"5px",border:"1px solid white"}} >
        <div className="py-5" style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <lottie-player  src="https://lottie.host/3d201c65-6393-4f6e-b415-af3d390394b3/7QoAiOIaJ4.json" background="##ffffff" speed="1" style={{width: 300+"px", height: 300+"px",border:"0px solid black",marginTop:"-100px"}} loop  autoplay direction="1" mode="normal">
          loading
        </lottie-player>
        <span  class="text-center" style={{width:"90%",border:"0px solid black",fontFamily:"",fontSize:"20px",marginTop:"-60px",color:"white"}}>
        <b>Processing Your Video...</b>
        </span>
        </div>

        
       
     
      </div>
      <LogViewer logs={logs} />
      

      
      
      
      </>
    }
    { !report&& !loading && msrc && <>
      {/* <div   className="my-3" style={{backgroundColor:"white",height:"8vh",width:"50vw",border:"0px solid black",display:"flex",justifyContent:"flex-end",flexDirection:"column",alignItems:"flex-start",marginLeft:""}}>
        <h3 class="my-3" style={{fontWeight:"bolder",lineHeight:"30px"}}>
        <i class="fa-solid fa-magnifying-glass fa-5xl me-3"></i>
        Video Analysis: Detailed Magnification Display :
        </h3>
        </div> */}
      
      <div style={{height:"10px"}}>

      </div>
      <div className="my-3  shadow" style={{backgroundColor:"black",height:"",width:"50vw",border:"1px solid white",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",borderRadius:"10px"}} >
      
     
      <video  className="shadow mt-5" style={{width:90+"%",marginBottom:"0px",borderRadius:"10px",maxHeight:"300px"}} controls>
  <source src="https://d9f0-2409-40d7-7-598-e4d1-9e10-abe6-878e.ngrok-free.app/uploads/uploads%5Cdownloaded_video_phase_magnified.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>'
{/* <div   className="mb-3 px-2" style={{backgroundColor:"",height:"8vh",width:"90%",border:"0px solid black",display:"",justifyContent:"flex-start",alignItems:"center",marginLeft:"",fontSize:"21px",color:"white"}}>
       <b>Maginified Video</b>
        </div> */}
      </div>
    
    

    </>

    }
   {loading && !report && <>

   <div  className="shadow" style={{border:"0px solid black",height:"90vh",width:"50vw",backgroundColor:"white",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
   <lottie-player src="https://lottie.host/08b99c03-812f-4dd0-8d13-cab395a129f8/j3tQW58GU7.json" background="##ffffff" speed="1" style={{width: 500+"px", height: 500+"px",border:"0px solid black"}} loop  autoplay direction="1" mode="normal">
          loading
        </lottie-player>
        <span  class="text-center" style={{width:"90%",border:"0px solid black",fontFamily:"",fontSize:"20px",marginTop:"-60px"}}>
        <b>Just a sec. Creating your Report...</b>
        </span>

        <span style={{width:"90%",border:"0px solid black",fontFamily:"sans-serif",fontSize:"25px",marginTop:"40px",marginBottom:"60px"}}>
        Sit back while we diagnose your machine's health! Like a doctor, we're thorough. Thanks for your patience as we ensure your machine's top-notch!<span style={{fontSize:"20px"}}>&#x1F31F;
        </span></span>


    


   </div>
   
   
   
   
   </>}
  
   {report && !loading && <>
    {/* <div  className=" mb-3 shadow" style={{backgroundColor:"white",height:"",width:"50vw",border:"0px solid black",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",marginTop:"80px"}}>
            <div className='machinetitle my-3'>
            <h1 style={{fontWeight:"800",fontSize:"3rem"}}>
            <i class="fa-solid fa-screwdriver-wrench fa-5xl me-3"></i>
            Machine Health Analysis
            </h1>
            </div>
          

        </div> */}
   <div  className="shadow" style={{width:"50vw",border:"0px solid black",minHeight:"100vh",justifyContent:"flex-start",alignItems:"center",display:"flex",flexDirection:"column",backgroundColor:"white"}}>
    <img  className="mt-5" src={convertToJpg("https://res.cloudinary.com/dbo7hzofg/video/upload/v1702477569/brjhuef6btkqkkl4ckiv.mp4")} alt="Some Error Occured" 
    style={{height:"400px",width:"auto"}}/>
    <p className='my-3 mx-3' style={{fontSize:"17px",border:"0px solid black",width:"70%"}}><b>Note: </b>Please note that this analysis is generated by AI, providing insightful assessments based on user inputs. While our system strives for accuracy, there might be rare instances of potential discrepancies or inaccuracies.</p>
    <hr />

    <div className='mt-5' style={{border:"0px solid black",width:"90%",display:"flex",justifyContent:"space-between"}}>
      <h2><b>Health Anlysis Report</b></h2>
      <button className="btn btn-primary">Download Report.</button>

   </div>
   <div  className="my-3" style={{border:"2px solid black",width:"80%"}}>
   Machine Health Analysis Report
Analysis Based on User's Responses:
The user's responses indicate a complete absence of observed motion, identified active areas, or influential factors influencing the machine's movement during the video analysis. The reported high instability is noteworthy, despite the lack of observed motion or active areas specified.

Conclusion:
The absence of observed motion or identified active areas, coupled with reported high instability, presents a puzzling scenario. Further investigation and diagnostic assessment are crucial to conclusively determine the underlying cause behind the machine's behavior.

This brief conclusion summarizes the absence of observed motion or identified active areas while highlighting the reported high instability, emphasizing the need for further investigation to ascertain the actual cause behind the machine's behaviors.

   </div>
   </div>

   
   </>}



      
    </div>
    </div></>)
}

export default Machinehealth
