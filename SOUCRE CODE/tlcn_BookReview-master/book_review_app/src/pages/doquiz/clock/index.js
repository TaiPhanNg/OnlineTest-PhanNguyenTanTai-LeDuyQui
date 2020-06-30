import React, { useState, useEffect } from 'react';

const IntervalExample = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [min,setMin]=useState(0)
  const [h,setH]=useState(0)
  const { submitAll } = props
  var x=0
  useEffect(() => {
    const interval = setInterval(() => {
       
      setSeconds(seconds => seconds + 1);
      
    }, 1000);
    
    
    return () => clearInterval(interval);
  }, []);
  if(seconds==60 )
  {
    
      setMin(min=>min+1)
      setSeconds(0)
  }
  if(min==60)
  {
      setH(h=>h+1)
      setMin(0)
      setSeconds(0)
  }
  if(h==2)
  {
      submitAll()
  }
  return (
   
      <div className="test-form-clock">
          <p>{h} giờ</p><p>{min} phút</p><p>{seconds} giây</p>
      </div>
    
  );
};

export default IntervalExample;