import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const FoxPostComponent = ({ setSelectedMachine }) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cdn.foxpost.hu/apms.json');
        const jsonData = await response.json();
        jsonData.sort((a, b) => a.zip - b.zip)
        setData(jsonData);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() =>{
    handleChange(value)
    }, [value]);
  
  const handleChange = (selectedOption) => {
    // Do something with the selected option
    // For example, update the value using setMyValue
    setSelectedMachine(selectedOption);
  };

  return (
    <>
    {data && (
    <Select
    name="foxpost"
    options={data}
    value={value}
    onChange={setValue}
    getOptionLabel={(option) => (option?.name === undefined ? "Kérjük ":option?.name+" - ") + (option?.address === undefined ? "válassz!":option?.address)}
    getOptionValue={(option) => option.name + " - " + option.address}
    />)}
    {value?.findme && (<p>Információ az automatáról: {JSON.stringify(value.findme)}</p>)}
    
    </>
  );
};

export default FoxPostComponent;