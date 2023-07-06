import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
    
const ToastyToast = ({type,body }) => {

        switch(type) {
            case 'error':
                
                toast.error(body, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                  });
            case 'success':
                toast.success(body, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                  });
                
            default:
              
           }
        // toast("Default Notification !");
  
        // toast.success("Success Notification !", {
        //   position: toast.POSITION.TOP_CENTER
        // });
  
        // toast.error("Error Notification !", {
        //   position: toast.POSITION.TOP_LEFT
        // });
  
        // toast.warn("Warning Notification !", {
        //   position: toast.POSITION.BOTTOM_LEFT
        // });
  
        // toast.info("Info Notification !", {
        //   position: toast.POSITION.BOTTOM_CENTER
        // });
  
        // toast("Custom Style Notification with css class!", {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   className: 'foo-bar'
        // });
  return (
    <>
        <ToastContainer>
        </ToastContainer>
    </>
  )
}

export default ToastyToast
