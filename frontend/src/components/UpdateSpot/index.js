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
  }

  return (
    <div>

    </div>
  )
};

export default UpdateSpot;
