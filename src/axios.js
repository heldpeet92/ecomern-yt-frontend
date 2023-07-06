import axios from "axios";
import React from "react";

const instance = axios.create({
    baseURL: process.env.REACT_APP_APIURL
})

// console.log(process.env.REACT_APP_APIURL)

export default instance;