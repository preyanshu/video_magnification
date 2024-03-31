import React from 'react'
import { useRef ,useState,useEffect} from 'react';
import { Link, useLocation,useNavigate} from "react-router-dom";
// import {useNavigate} from 'react-router-dom';
// import Sidebar_2 from "./Sidebar_2";

import "./notifications.css"

const Feedback= (props) => {
  const[flag,setflag]=useState(false);
  const[flag2,setflag2]=useState(true);
  const[collapse,setcollapse]=useState(false);
//   const desiredWidth = !flag2 ? '5vw' : '16vw';
  const desiredWidth2 = !collapse ? '84vw' : '96vw';
  const desiredWidth3 = !collapse ? '84vw' : '96vw';
  const location=useLocation();
  const navigate=useNavigate();
  const dynamicStyles2 = {

    Height: 100+"vh",
    width: collapse? "4vw" : "16vw",
    transition:"0.3s",
    position:"relative",
    zIndex:100
    
  };

    const ref=useRef();
    const [credentials, setCredentials] = useState({name: "", email: "",message:""}) ;
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      // setLoading(true);
      // const { email, password } = credentials;
  
      try {
        const response = await fetch("http://localhost:5000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email:credentials.email,
            password:credentials.password,
          }),
        });
        // setLoading(false);
        const json = await response.json();
  
        if (json.success) {
          // setLoading(false);
  
          localStorage.setItem("token", JSON.stringify(json));
          console.log("json",json);
          
          // navigate("/user1");
        }
        
        else {
          // setLoading(false);
          alert("Invalid Credentials");
        }
      } catch (error) {
          alert(error);
      }
  }
   



  return (<>
    <div className='mainbg'>
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
<lottie-player src="https://lottie.host/2ee7d6ca-1b37-42ea-9f95-dd27434da0b4/I02QrsEa3F.json" background="##FFFFFF" speed="1" style={{width: "270px", height: "270px"}} loop  autoplay direction="1" mode="normal"></lottie-player>
<span style={{color:"white",fontSize:"30px",fontWeight:"900",marginTop:"-35px"}}>
Hi,there.
</span>
</>}
{collapse && <>
<br /> <br /> <br /><br /><br /><br /><br /><br />
</>}


<hr />
{!collapse &&<>
<div className="p mt-3"  onClick={()=>{
  navigate("/machinehealth")
}}><i class="fa-solid fa-screwdriver-wrench me-3"></i>Machine Health</div>
{/* <div className="p"><i class="fa-solid fa-notes-medical me-3"></i>Human Health</div> */}
<div className="p"style={{backgroundColor:"#1D66D3"}} onClick={()=>{
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
<div className="p mt-3" onClick={()=>{
  navigate("/machinehealth")
}} ><i class="fa-solid fa-screwdriver-wrench "></i></div>
{/* <div className="p"><i class="fa-solid fa-notes-medical me-3"></i>Human Health</div> */}
<div className="p" style={{backgroundColor:"#1D66D3"}} onClick={()=>{
  navigate("/feedback")
}}><i class="fa-solid fa-message "></i></div>
<div className="p"   onClick={()=>{
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
     
    <div className="notificationbg" style={{width:desiredWidth2,transition:"0.3s"}}>     
      

    

    <div className="notifications" style={{width:desiredWidth3,transition:"0.3s"}}>
   <div className="text-left pt-3 pl-5  pe-5" style={{paddingLeft:54+"px",paddingBottom:-10+"px",display:"flex",justifyContent:"space-between",border:"0px solid black",width:78+"vw",position:"absolute",top:10+"px",zIndex:1000000}}><div>{location.pathname}<br></br><h5></h5></div></div>

<div className="a shadow " style={{height:80+"vh",width:76+"vw",backgroundColor:"white",borderRadius:13+"px",border:"0px solid black",padding:25+"px",marginTop:30+"px",display:"flex",justifyContent:"space-evenly"}}>

        {/* <h2 style={{marginTop:15+"px",marginBottom:12+"px",fontFamily:"sans-serif"}}><b>Get in Touch</b></h2>
        <span className='subtxt mb-5' style={{marginLeft:"5px",color:"darkgray",fontSize:"20px",marginBottom:"20px"}}>WE are here for You! How can we Help?</span> */}
        {/* <i class="fa-solid fa-check fa-lg" style={{color: "#2dbe45"}}></i> <b>Lorem </b> ipsum dolor <br /> <br /> */}
        <div  className=""style={{backgroundColor:"",height:75+"vh",marginTop:0+"px",width:40+"%"}}>
            <h2  className="mt-5" style={{marginTop:15+"px",marginBottom:12+"px",fontFamily:"sans-serif",marginLeft:"30px",fontWeight:"bold",color:""}}><b>Feedback Form</b></h2>
        {/* <span className='subtxt mb-5 my-3' style={{marginLeft:"35px",color:"darkgrey",fontSize:"20px",marginBottom:"40px",fontWeight:"bold"}}>WE are here for You! How can we Help?</span> */}

        <form style={{width:80+"%",minWidth:300+"px",marginLeft:"35px",marginTop:20+"px"}} onSubmit={handleSubmit}>
        




<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingPassword" placeholder="Password" style={{ height:80+"px",backgroundColor:""}} name='email' onChange={onChange} required/>
  <label for="floatingPassword">Enter your email address</label>
</div>
<div class="form-floating mb-3">
  <input type="number" class="form-control" id="floatingInput" placeholder="name@example.com" style={{height:80+"px",backgroundColor:""}} name='name' onChange={onChange} required/>
  <label for="floatingInput"> Give Us a Score (1-10)</label>
</div>
  <div class="mb-5">
  <div class="form-floating">
  <input class="form-control" placeholder="Go ahead, We are listening" id="floatingTextarea2" style={{height: "200px",backgroundColor:""}} name='message' onChange={onChange} required min={5}></input>
  <label  for="floatingTextarea2"> <span style={{backgroundColor:"",margin:"0px",padding:"0px"}}>Please tell us your reasons for giving this score ...</span></label>
</div>
  </div>

  <button type="submit"  style={{height:60+"px",width:"100%",fontWeight:"bolder",fontSize:25+"px"}} class="btn btn-primary " id=''> Submit</button>
</form>
        
        
   
          </div>   
        <div style={{backgroundColor:"",height:75+"vh",marginTop:0+"px",width:40+"%"}}>
          
          <div style={{border:"0px solid black",display:"flex",flexDirection:"column",alignItems:"center",marginTop:"0px"}}>

            <div style={{marginLeft:-30+"px",marginTop:20+"px"}}>
                <h4 style={{marginTop:20+"px",marginBottom:12+"px",fontFamily:"sans-serif",marginLeft:"30px",fontWeight:"bold",color:""}}>How Satisfied You are with us ?</h4>
            <div style={{color:"",marginLeft:30+"px"}}>
            <h5 className='mb-5 mt-5'>0 - not at all satisfied</h5>
            <h5 className='mb-5'>1 - not very satisfied</h5>
            <h5 className='mb-5'>10 - very satisfied</h5>
            </div>
            </div>
           
            
          </div>
          <img src="../undraw_reviews_lp8w.png" style={{height:300+"px",width:"auto"}} alt="" />
          </div>   
    </div>


</div>

    </div>
 



      
    </div>
 
  </>)
}

export default Feedback
