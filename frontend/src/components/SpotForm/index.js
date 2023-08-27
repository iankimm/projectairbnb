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
  }

  return (
    <form onSubmit={handleSubmit}>
      <title>{formType}</title>
      <h2>{formType}</h2>
      <div>
        <header>Where's your place located?</header>
        <div>
          Guest will only get your exact address once they booked a reservation
        </div>
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
      </div>
      <div>
        <header>Describe your place to guests</header>
        <div>
          Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the nieghborhood.
        </div>
        <label>
        description:
        <input
          type="text"
          value={description}
          placehoder='Please write atleast 30 characters'
          onChange={(e)=> setDescription(e.target.value)}
        />
      </label>
      </div>
      <div>
        <header>Create a title for your spot</header>
        <div>
          Catch guests' attention with a spot title that highlights what makes your place special.
        </div>
        <label>
        name:
        <input
          type="text"
          value={name}
          placeholder='Name of your spot'
          onChange={(e)=> setName(e.target.value)}
        />
      </label>
      </div>
      <div>
        <header>Set a base price for your spot</header>
        <div>
          Competitive pricing can help your listing stand out and rank higher in search results.
        </div>
        <label>
        price:
        <input
          type="text"
          value={price}
          placeholder='Price per night (USE)'
          onChange={(e)=> setPrice(e.target.value)}
        />
      </label>
      </div>
      <div>
        <header>Liven up your spot with photos</header>
        <div>
          Submit a link to at least one photo to publish your spot
        </div>
      </div>

      <button type="submit">Create Spot</button>
    </form>
  )
}

export default SpotForm;
