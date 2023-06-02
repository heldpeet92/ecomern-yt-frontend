import React, { useState } from 'react'
import { Toast, ToastBody, ToastContainer, ToastHeader } from 'react-bootstrap';
import './ToastMessage.css'
import ToastyToast from './ToastyToast';

const ToastMessage = ({type,body}) => {
    const[show, setShow] = useState(true);
  return (
    <ToastyToast type={type} body={body}/>
    // <ToastContainer position='bottom-right' className='toast-container'>
    //     <Toast bg={bg} onClose={()=>setShow(false)} show={show} delay={3000} autohide>
    //         <Toast.Header>
    //             <strong className='me-auto'>{title}</strong>
    //             <small>now</small>
    //         </Toast.Header>
    //         <Toast.Body>
    //             {body}
    //         </Toast.Body>
    //     </Toast>
    // </ToastContainer>
  )
}

export default ToastMessage