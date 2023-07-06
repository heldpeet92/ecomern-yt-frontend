import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Payment from './Payment'
import Completion from './Completion'


import {loadStripe} from '@stripe/stripe-js';

const TestFetcher = () => {
    const [ stripePromise, setStripePromise ] = useState(null);

    useEffect(() => {
      fetch("/config").then(async (r) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey));
      });
    }, []);
  
    return (
      <></>
    );
}

export default TestFetcher
