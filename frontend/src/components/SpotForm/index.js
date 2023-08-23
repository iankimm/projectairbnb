import './SpotForm.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { insertSpot } from '../../store/spot';

const SpotForm = ({ spot, formType}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //spot information
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    //needs to be added to state
    spot = {address, city, state, country, lat, lng, name, description, price};
    dispatch(insertSpot(spot));
    console.log(spot);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType}</h2>
      <label>
        address:
        <input
          type="text"
          value={address}
          onChange={(e)=> setAddress(e.target.value)}
        />
      </label>
      <label>
        city:
        <input
          type="text"
          value={city}
          onChange={(e)=> setCity(e.target.value)}
        />
      </label>
      <label>
        state:
        <input
          type="text"
          value={state}
          onChange={(e)=> setState(e.target.value)}
        />
      </label>
      <label>
        country:
        <input
          type="text"
          value={country}
          onChange={(e)=> setCountry(e.target.value)}
        />
      </label>
      <label>
        lat:
        <input
          type="text"
          value={lat}
          onChange={(e)=> setLat(e.target.value)}
        />
      </label>
      <label>
        lng:
        <input
          type="text"
          value={lng}
          onChange={(e)=> setLng(e.target.value)}
        />
      </label>
      <label>
        name:
        <input
          type="text"
          value={name}
          onChange={(e)=> setName(e.target.value)}
        />
      </label>
      <label>
        description:
        <input
          type="text"
          value={description}
          onChange={(e)=> setDescription(e.target.value)}
        />
      </label>
      <label>
        price:
        <input
          type="text"
          value={price}
          onChange={(e)=> setPrice(e.target.value)}
        />
      </label>
      <button type="submit">{formType}</button>
    </form>
  )
}

export default SpotForm;
