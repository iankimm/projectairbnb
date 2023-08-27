import { useState } from 'react';
import './UpdateSpot.css'
import { useDispatch } from 'react-redux';

const UpdateSpot = ({spot}) => {

  const dispatch = useDispatch();

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    spot = {address, city, state, country, lat, lng, name, description, price};
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
          placeholder={address}
          onChange={(e)=> setAddress(e.target.value)}
        />
      </label>
      <label>
        city:
        <input
          type="text"
          value={city}
          placeholder={city}
          onChange={(e)=> setCity(e.target.value)}
        />
      </label>
      <label>
        state:
        <input
          type="text"
          value={state}
          placeholder={state}
          onChange={(e)=> setState(e.target.value)}
        />
      </label>
      <label>
        country:
        <input
          type="text"
          value={country}
          placeholder={country}
          onChange={(e)=> setCountry(e.target.value)}
        />
      </label>
      <label>
        lat:
        <input
          type="text"
          value={lat}
          placeholder={lat}
          onChange={(e)=> setLat(e.target.value)}
        />
      </label>
      <label>
        lng:
        <input
          type="text"
          value={lng}
          placeholder={lng}
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
          placeholder={description}
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
          placeholder={name}
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
          placeholder={price}
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
};

export default UpdateSpot;
