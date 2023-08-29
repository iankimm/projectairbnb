import './SpotForm.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { insertSpot } from '../../store/spot';
import { fetchSpotIdOwner } from '../../store/currentSpotOwner';
import { fetchSpotIdReviews } from '../../store/review';
import { fetchImageById } from '../../store/image';
import * as sessionActions from '../../store/spot'


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
  const [previewImage, setPreviewImage] = useState('');
  const [oneImage, setOneImage] = useState('');
  const [twoImage, setTwoImage] = useState('');
  const [threeImage, setThreeImage] = useState('');
  const [fourImage, setFourImage] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e) {
      setErrors({});
      if(lat === '') setLat("0");
      if(lng === '') setLng("0");
      return dispatch(
        sessionActions.insertSpot({
          address, city, state, country, lat, lng, name, description, price, previewImage, oneImage, twoImage, threeImage, fourImage
        })
      )
        .then(response => history.push(`/spots/${response.id}`))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }

    // if(lat === '') setLat("0");
    // if(lng === '') setLng("0");
    // //needs to be added to state
    // spot = {address, city, state, country, lat, lng, name, description, price, previewImage, oneImage, twoImage, threeImage, fourImage};
    // const createdSpot = await dispatch(insertSpot(spot))
    // const spotId = createdSpot.id;
    // history.push(`/spots/${spotId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="spotformform">
      <title>{formType}</title>
      <h2>{formType}</h2>
      <div>
        <div className="spotformtitle">Where's your place located?</div>
        <div>
          Guest will only get your exact address once they booked a reservation
        </div>
        <br></br>
        <div>
        <label>
          <div>
          Country: {errors.country && <p>{errors.country}</p>}
          </div>
          <input
            type="text"
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
            placeholder="country"
          />
        </label>

      </div>
        <div>
          <label>
            <div>
              Address: {errors.address && <p>{errors.address}</p>}
            </div>
          <input
            type="text"
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
            placeholder="address"
          />
        </label>

      </div>
        <label>
          <div>
            City: {errors.city && <p>{errors.city}</p>}  {errors.state && <p>{errors.state}</p>}
          </div>
          <input
            type="text"
            value={city}
            onChange={(e)=> setCity(e.target.value)}
            placeholder="city"
          />
        </label>
        <label>
          ,
          <input
            type="text"
            value={state}
            onChange={(e)=> setState(e.target.value)}
            placeholder="state"
          />
        </label>

      <div>
        <label>
          <div>
          Latitude:
          </div>
          <input
            type="text"
            value={lat}
            onChange={(e)=> setLat(e.target.value)}
            placeholder="OPTIONAL FOR MVP"
          />
        </label>
        <div>{errors.lat && <p>{errors.lat}</p>}</div>
      </div>
      <div>
        <label>
          <div>
          Longitude:
          </div>
          <input
            type="text"
            value={lng}
            onChange={(e)=> setLng(e.target.value)}
            placeholder="OPTIONAL FOR MVP"
          />
        </label>
        <div>{errors.lng && <p>{errors.lng}</p>}</div>
      </div>
      </div>
      <hr></hr>
      <div>
        <div className="spotformtitle">Describe your place to guests</div>
        <div>
          Mention the best features of your space, any special amentities like <br></br>fast wifi or parking, and what you love about the nieghborhood.
        </div>
        <div>
          <label>
          <input
            className="descriptionbox"
            type="text"
            value={description}
            placeholder='Please write atleast 30 characters'
            onChange={(e)=> setDescription(e.target.value)}
          />
          </label>
          <div>{errors.description && <p>{errors.description}</p>}</div>
        </div>
      </div>
      <hr></hr>
      <div>
        <div className="spotformtitle">Create a title for your spot</div>
        <div>
          Catch guests' attention with a spot title that highlights what makes<br></br> your place special.
        </div>
        <label>
        <input
          type="text"
          value={name}
          placeholder='Name of your spot'
          onChange={(e)=> setName(e.target.value)}
        />
      </label>
      <div>{errors.name && <p>{errors.name}</p>}</div>
      </div>
      <hr></hr>
      <div>
      <div className="spotformtitle">Set a base price for your spot</div>
        <div>
          Competitive pricing can help your listing stand out and rank higher<br></br> in search results.
        </div>
        <label>
        $
        <input
          type="text"
          value={price}
          placeholder='Price per night (USD)'
          onChange={(e)=> setPrice(e.target.value)}
        />
      </label>
      <div>{errors.price && <p>{errors.price}</p>}</div>
      </div>
      <hr></hr>
      <div>
      <div className="spotformtitle">Liven up your spot with photos</div>
        <div>
          Submit a link to at least one photo to publish your spot
        </div>
        <div>
          <input
          type="text"
          placeholder='Preview Image URL'
          onChange={(e) => setPreviewImage(e.target.value)}
          required />
          <div>
            <input
            type="text"
            placeholder='Image URL'
            onChange={(e) => setOneImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            onChange={(e) => setTwoImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            onChange={(e) => setThreeImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            onChange={(e) => setFourImage(e.target.value)} />
          </div>
        </div>
      </div>
      <hr></hr>

      <button type="submit">Create Spot</button>
    </form>
  )
}

export default SpotForm;
