// import React from 'react'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import "./signup.css";

const Signup = (props) => {
    const {showAlert}=props
    const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:"",type:""}) 
    const[type,setType]=useState("User Type 1");
    const [loading, setLoading] = useState(false) 
    
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (credentials.password !== credentials.cpassword) {
            setLoading(false);
            alert("password did not match");
            return 0;
          }
      
          try {
            const response = await fetch("http://localhost:5000/api/user/createuser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name:credentials.name,
                email:credentials.email,
                password:credentials.password
                
              }),
            });
            const json = await response.json();
      
            console.log(json);
            setLoading(false);
      
            if (json.success) {
      
               alert("Registration Successful")
      
               localStorage.setItem("token", JSON.stringify(json));
               navigate("/user1");
            } else {
              alert("Invalid Credentials");
            }
          } catch (error) {
            console.log(error);
          }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    const onChange2 = (e)=>{
        const selectedValue = e.target.value;
        setType( selectedValue );

    }


  return (
    <div id='signuppage'>
        <div>
            {/* <img src="cartoon-os-upgrade.png"  alt="" /> */}
            <lottie-player src="https://lottie.host/e85c3829-dba1-48ca-afa5-c02ec9e9a59c/guq6M5BuG5.json" background="##FFFFFF" speed="1" style={{width:35+"vw",height:"auto",minWidth:270+"px",marginLeft:10+"px"}} loop autoplay direction="1" mode="normal"></lottie-player>
        </div>

    <div className='container shadow' id='spg'>
        {!loading &&  <h1 className='text-center pb-3'><b>Welcome!</b></h1>}
           
            {loading && <h1 className='text-center'>LOADING..</h1>}
            {!loading && <form  onSubmit={handleSubmit}>
            <div className="mb-3 d-flex" style={{justifyContent:"space-between"}}>
                <div style={{width:100+"%",display:"inline-block"}}>
                <label htmlFor="name" className="form-label"><b>Name</b></label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text"></div>
                </div>
                {/* <div style={{width:36+"%"}}> 
                    <label htmlFor="name" className="form-label"><b>You are a ?</b></label>
                <select class="form-select"  aria-label="Default select example" style={{border:"2px solid blue",borderRadius:0+"px"}} value={type} onChange={onChange2} id="type" name="type" required >
 
  <option value="one">User Type 1</option>
  <option value="Two">User Type 2</option>
  <option value="Three">User Type 3</option>
</select></div> */}
               
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label"><b>Email address</b></label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label"><b>Password</b></label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label"><b>Confirm Password</b></label>
                    <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" minLength={5} required/>
                </div>

                <button type="submit mt-3" className="btn btn-success" id="spg_btn" style={{height:50+"px",width:200+"px",marginTop:10+"px"}}><b>Submit</b></button>
            </form>}
            
        </div>
        </div>
  )
}

export default Signup
