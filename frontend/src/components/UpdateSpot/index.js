import './UpdateSpot.css'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editSpot, fetchSpots } from '../../store/spot';
import { fetchImageById } from '../../store/image';
import { useEffect } from 'react';


const UpdateSpot = ({ spotId }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const spots = useSelector(state => Object.values(state.spots))

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

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(lat === '') setLat("0");
    if(lng === '') setLng("0");

    const newSpot = {
      address: address, city: city, state: state, country: country, lat: lat, lng: lng, name: name, description: description, price: price,
    }

    try {
      const updated = await dispatch(editSpot(spotId, newSpot
        // previewImage, oneImage, twoImage, threeImage, fourImage
      ))
      history.push(`/spots/${updated.id}`);

    } catch(res) {
      console.log('res', res);
      const data = await res.json();
      if(data){
        const merged = {...data.errors}
        setErrors(merged);
      }
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
    dispatch(fetchSpots(spots))
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
        {
          Object.keys(errors).length > 0 ? (
            Object.keys(errors).map((key) => (
              <p>{errors[key]}</p>
            ))
          ) : ""
        }
      </div>
      <div>
      <div className="spotformtitle">Where's your place located?</div>
        <div>
          Guest will only get your exact address once they booked a reservation
        </div>
        <br></br>
        <div>
        <label>
          <div>
          Country:
          </div>
          <input
            type="text"
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
          />
        </label>
        </div>
        <div>
          <label>
            <div>
              Address:
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
            City:
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
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required />
          <div>
            <input
            type="text"
            value={oneImage}
            placeholder='Image URL'
            onChange={(e) => setOneImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            value={twoImage}
            placeholder='Image URL'
            onChange={(e) => setTwoImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            value={threeImage}
            placeholder='Image URL'
            onChange={(e) => setThreeImage(e.target.value)} />
          </div>
          <div>
            <input
            type="text"
            value={fourImage}
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

export default UpdateSpot;
