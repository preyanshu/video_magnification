import React, { useEffect, useRef,useState } from 'react';

const Uploadwidget = () => {
  const ref = useRef();
  const ref2 = useRef();
  const [src,setsrc]=useState(null);
  const [q,setq]=useState(1);


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

          console.log(r.info.url);
          setsrc(r.info.url);
        }
      }
    );
  }, []);
  function convertToDownloadableLink(url) {
    const downloadableURL = url.replace(
      '/upload/',
      '/upload/fl_attachment/'
    );
  
    return downloadableURL;
  }

  const handleDownload = () => {
    // Create an anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href =convertToDownloadableLink(src) ;
    // downloadLink.download = 'video.mp4';
    downloadLink.click();
  };
  const [slideDirection, setSlideDirection] = useState('');

  const handleNextClick = () => {
      setSlideDirection('slideInRight');
      setTimeout(() => {
        setSlideDirection('');
    }, 1000);
  };

  const handlePreviousClick = () => {
      setSlideDirection('slideInLeft');
      setTimeout(() => {
        setSlideDirection('');
    }, 1000);
  };

 
};

const handleSubmit = () => {
  const answeredQuestions = Object.values(answers);
  if (answeredQuestions.includes('')) {
      // If any question is unanswered
      alert('Please answer all the questions.');
      console.log(answers);
  } else {
      // All questions answered, proceed with submission logic
      alert('Form submitted successfully!');
      console.log(answers);
  }
};
const q1ans=[
  "Small Business Owner or Employee","Nonprofit Owner or Employee","journalist and activist","other"
]
const q2ans=[
  "Small Business Owner or Employee","Nonprofit Owner or Employee","journalist and activist","other"
]
const q3ans=[
  "Small Business Owner or Employee","Nonprofit Owner or Employee","journalist and activist","other"
]
const q4ans=[
  "Small Business Owner or Employee","Nonprofit Owner or Employee","journalist and activist","other"
]
const q5ans=[
  "Small Business Owner or Employee","Nonprofit Owner or Employee","journalist and activist","other"
]





  return (
    <div>
      <button
        onClick={() => {
          ref2.current.open();
        }}
      >
        Upload
      </button>
{src && <video width="320" height="240" controls controlsList="nodownload">
  <source src={src} type="video/mp4"/>
  {/* <source src={src} type="video/ogg"/> */}
Your browser does not 
support the video tag.
</video>}
<video controls>
  <source src="http://127.0.0.1:5000/uploads/uploads%5Cdownloaded_video_processed.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>
<button onClick={handleDownload}>Download Video</button>
<div class="container mt-sm-5 my-1">
  <div className="indicator" style={{position:"absolute",right:"20px",border:"0px solid white",height:30+"px",width:150+"px",top:32+"px",display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
    <div className={`q1 ${answers.q1 === '' ? 'red' : 'green'}`} style={{height:"20px",width:"20px",border:"1px solid white",borderRadius:"100%"}}></div>
    <div className={`q2 ${answers.q2 === '' ? 'red' : 'green'}`} style={{height:"20px",width:"20px",border:"1px solid white",borderRadius:"100%"}}></div>
    <div className={`q3 ${answers.q3 === '' ? 'red' : 'green'}`} style={{height:"20px",width:"20px",border:"1px solid white",borderRadius:"100%"}}></div>
    <div className={`q4 ${answers.q4 === '' ? 'red' : 'green'}`} style={{height:"20px",width:"20px",border:"1px solid white",borderRadius:"100%"}}></div>
    <div className={`q5 ${answers.q5 === '' ? 'red' : 'green'}`} style={{height:"20px",width:"20px",border:"1px solid white",borderRadius:"100%"}}></div>
  </div>
   {q==1 &&  <div className={`question ml-sm-5 pl-sm-5 pt-2  ${slideDirection}`}>
        <div class="py-2 h5"><b>Q. which option best describes your job role?</b></div>
        <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            <label class="options">Small Business Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q1', q1ans[0]);
                  
                }} checked={answers.q1 ===q1ans[0]}/>
                <span class="checkmark"></span>
            </label>
            <label class="options">Nonprofit Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q1', q1ans[1]);
                }} checked={answers.q1 === q1ans[1]}/>
                <span class="checkmark"></span>
            </label>
            <label class="options">Journalist or Activist
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q1', q1ans[2]);
                }} checked={answers.q1 === q1ans[2]}  />
                <span class="checkmark"></span>
            </label>
            <label class="options">Other
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q1', q1ans[3]);
                }} checked={answers.q1 === q1ans[3]} />
                <span class="checkmark"></span>
            </label>
        </div>
    </div>}
   {q==2 &&  <div className={`question ml-sm-5 pl-sm-5 pt-2  ${slideDirection}`}>
        <div class="py-2 h5"><b>Q2. which option best describes your job role?</b></div>
        <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            <label class="options">Small Business Owner or Employee
                <input type="radio" name="radio"onChange={()=>{
                  handleOptionChange('q2', q2ans[0]);
                }}
                checked={answers.q2 === q2ans[0]}/>
                <span class="checkmark"></span>
            </label>
            <label class="options">Nonprofit Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q2', q2ans[1]);
                }}
                checked={answers.q2 === q2ans[1]}
                />
                <span class="checkmark"></span>
            </label>
            <label class="options">Journalist or Activist
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q2', q2ans[2]);
                }}
                checked={answers.q2 === q2ans[2]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Other
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q2', q2ans[3]);
                }}
                checked={answers.q2 === q2ans[3]}/>
                <span class="checkmark"></span>
            </label>
        </div>
    </div>}
   {q==3 &&  <div className={`question ml-sm-5 pl-sm-5 pt-2  ${slideDirection}`}>
        <div class="py-2 h5"><b>Q3. which option best describes your job role?</b></div>
        <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            <label class="options">Small Business Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q3', q3ans[0]);
                }}
                checked={answers.q3 === q3ans[0]}/>
                <span class="checkmark"></span>
            </label>
            <label class="options">Nonprofit Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q3', q3ans[1]);
                }}
                checked={answers.q3 === q3ans[1]}/>
                <span class="checkmark"></span>
            </label>
            <label class="options">Journalist or Activist
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q3', q3ans[2]);
                }}
                checked={answers.q3 === q3ans[2]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Other
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q3', q3ans[3]);
                }}
                checked={answers.q3 === q3ans[3]}/>
                <span class="checkmark"></span>
            </label>
        </div>
    </div>}
   {q==4 &&  <div className={`question ml-sm-5 pl-sm-5 pt-2  ${slideDirection}`}>
        <div class="py-2 h5"><b>4. which option best describes your job role?</b></div>
        <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            <label class="options">Small Business Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q4', q4ans[0]);
                }}
                checked={answers.q4 === q4ans[0]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Nonprofit Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q4', q4ans[1]);
                }}
                checked={answers.q4 === q4ans[1]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Journalist or Activist
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q4', q4ans[2]);
                }}
                checked={answers.q4 === q4ans[2]}  />
                <span class="checkmark"></span>
            </label>
            <label class="options">Other
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q4', q4ans[3]);
                }}
                checked={answers.q4 === q4ans[3]}  />
                <span class="checkmark"></span>
            </label>
        </div>
    </div>}
   {q==5 &&  <div className={`question ml-sm-5 pl-sm-5 pt-2  ${slideDirection}`}>
        <div class="py-2 h5"><b>Q5. which option best describes your job role?</b></div>
        <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            <label class="options">Small Business Owner or Employee
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q5', q5ans[0]);
                }}
                checked={answers.q5 === q5ans[0]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Nonprofit Owner or Employee
                <input type="radio" name="radio"  onChange={()=>{
                  handleOptionChange('q5', q5ans[1]);
                }}
                checked={answers.q5 === q5ans[1]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Journalist or Activist
                <input type="radio" name="radio"  onChange={()=>{
                  handleOptionChange('q5', q5ans[2]);
                }}
                checked={answers.q5 === q5ans[2]} />
                <span class="checkmark"></span>
            </label>
            <label class="options">Other
                <input type="radio" name="radio" onChange={()=>{
                  handleOptionChange('q5', q5ans[3]);
                }}
                checked={answers.q5 === q5ans[3]} />
                <span class="checkmark"></span>
            </label>
        </div>
    </div>}
    <div class="d-flex align-items-center pt-3" style={{justifyContent:"space-between"}}>
        <div id="prev">
            <button class="btn btn-primary pbtn" id="pbtn"onClick={()=>{
              handlePreviousClick();
              if(q==1){
                setq(5);
              }
              else{
                setq(q-1);
              }
              
            }}>Previous</button>
        </div>
        <div class="ml-auto mr-sm-5">
           {q!=5 && 
            <button class="btn btn-success nbtn" id="ntbn" onClick={()=>{
              handleNextClick();
              if(q==5){
                setq(1);
              }
              else{
                setq(q+1);
              }
              
            }} style={{}}>Next</button>
           
           }
           {q==5 && 
            <button class="btn btn-success nbtn" id="ntbn" onClick={()=>{
              handleSubmit();
              
              
            }}>Submit</button>
           
           }
        </div>
    </div>
</div>
      
      
    </div>
  );
};

export default Uploadwidget;
