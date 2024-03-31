import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';




const Login = (props) => {
    const {showAlert}=props;
    const [credentials, setCredentials] = useState({email: "", password: ""}) 
    const [loading, setLoading] = useState(false) ;
    // let history = useHistory();
    let navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
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
          setLoading(false);
          const json = await response.json();
    
          if (json.success) {
            setLoading(false);
    
            localStorage.setItem("token", JSON.stringify(json));
            console.log("json",json);
            
            navigate("/user1");
          }
          
          else {
            setLoading(false);
            alert("Invalid Credentials");
          }
        } catch (error) {
            alert(error);
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };


    return (<>
    
    
    
        
                <div className="flex1 flex2 flex">
                <div  class="home" style={{position:"absolute",top:20+"px",left:"20px"}} onClick={()=>{
                    navigate("/");
                }
                    
                }>
                    <h6><i class="fa-solid fa-arrow-left me-3"></i> Home</h6>

                  </div>
                    {!loading && <div>
                        <lottie-player src="https://lottie.host/e1099103-9082-458f-9820-90f8929e924c/Ujk9LgevjJ.json" background="" speed="1" style={{height:300+"px",width:300+"px"}} loop autoplay direction="1" mode="normal"></lottie-player>
                        
                        <div className="text-center"vstyle={{width:100+"vw"}}><h1 className='text-center pb-3'><b>Welcome Back !</b></h1></div></div> }
                 

         {loading && <h1>  LOADING...</h1>}
         {!loading && <div className='login ' style={{width:40+"%",minWidth:270+"px"}} id='spg'>
           
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label"><b>E mail</b></label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label"><b>Password</b></label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>

                <button type="submit" id='spg_btn' className="btn btn-success mb-3 mt-3" style={{height:50+"px",width:200+"px"}}><b>Submit</b></button>
            </form>
        </div> }
                    
            
                
               </div>                
         
               </>)
}

export default Login
