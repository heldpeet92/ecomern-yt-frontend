import React from 'react'

const SaveAnonCart = (props) => {
    const copyCartObj = JSON.parse(localStorage.getItem("cart"));
        const cartObj = {total: 0, count:0,}
        localStorage.setItem("cart", JSON.stringify(cartObj));  
    return 1;
}

export default SaveAnonCart
