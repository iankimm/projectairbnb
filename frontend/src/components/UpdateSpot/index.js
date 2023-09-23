import './UpdateSpot.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { insertSpot } from '../../store/spot';
import { fetchSpotIdOwner } from '../../store/currentSpotOwner';
import { fetchSpotIdReviews } from '../../store/review';
import { fetchImageById } from '../../store/image';
import * as sessionActions from '../../store/spot'
import { useEffect } from 'react';


const UpdateSpot = ({ spotId }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //spot information
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState('');
  const [oneImage, setOneImage] = useState('');
  const [twoImage, setTwoImage] = useState('');
  const [threeImage, setThreeImage] = useState('');
  const [fourImage, setFourImage] = useState('');
  const [details, setDetails] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    description: "",
    name: "",
    price: "",
  })

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e) {
      setErrors({});
      if(lat === '') setLat("0");
      if(lng === '') setLng("0");
      return dispatch(
        sessionActions.editSpot(spotId, {
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

  useEffect(() => {
    dispatch(fetchImageById(spotId))
    .then((existingSpot) => {
      if(existingSpot) {
        //console.log(existingSpot)
        setAddress(existingSpot.address)
        setCity(existingSpot.city)
        setCountry(existingSpot.country)
        setDescription(existingSpot.description)
        setLat(existingSpot.lat)
        setLng(existingSpot.lng)
        setName(existingSpot.name)
        setPrice(existingSpot.price)
        setState(existingSpot.state)
        //console.log(existingSpot.SpotImages[0])
        if(existingSpot.SpotImages[0]) setPreviewImage(existingSpot.SpotImages[0].url)
        if(existingSpot.SpotImages[1]) setOneImage(existingSpot.SpotImages[1].url)
        if(existingSpot.SpotImages[2]) setTwoImage(existingSpot.SpotImages[2].url)
        if(existingSpot.SpotImages[3]) setThreeImage(existingSpot.SpotImages[3].url)
        if(existingSpot.SpotImages[4]) setFourImage(existingSpot.SpotImages[4].url)
      }
    })
  }, [dispatch, spotId])

  return (
    <form onSubmit={handleSubmit} className="spotformform">
      <title>Update your Spot</title>
      <h2>Update your Spot</h2>
      <div>
        <header>Where's your place located?</header>
        <div>
          Guest will only get your exact address once they booked a reservation
        </div>
        <div>
          <label>
          address:
          <input
            type="text"
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          city:
          <input
            type="text"
            value={city}
            onChange={(e)=> setCity(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          state:
          <input
            type="text"
            value={state}
            onChange={(e)=> setState(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          country:
          <input
            type="text"
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Latitude:
          <input
            type="text"
            value={lat}
            onChange={(e)=> setLat(e.target.value)}
            placeholder="OPTIONAL FOR MVP"
          />
        </label>
      </div>
      <div>
        <label>
          longitude:
          <input
            type="text"
            value={lng}
            onChange={(e)=> setLng(e.target.value)}
            placeholder="OPTIONAL FOR MVP"
          />
        </label>
      </div>
      </div>
      <div>
        <header>Describe your place to guests</header>
        <div>
          Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the nieghborhood.
        </div>
        <div>
          <label>
          description:
          <input
            className="descriptionbox"
            type="text"
            value={description}
            placeholder='Please write atleast 30 characters'
            onChange={(e)=> setDescription(e.target.value)}
          />
          </label>
        </div>
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
        <div>
          <input
          type="text"
          placeholder='Preview Image URL'
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required />
          <div>
            <input
            type="text"
            placeholder='Image URL'
            value={oneImage}
            onChange={(e) => setOneImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            value={twoImage}
            onChange={(e) => setTwoImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            value={threeImage}
            onChange={(e) => setThreeImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            placeholder='Image URL'
            value={fourImage}
            onChange={(e) => setFourImage(e.target.value)} />
          </div>
        </div>
      </div>

      <button type="submit">Create Spot</button>
    </form>
  )
}

export default UpdateSpot;
