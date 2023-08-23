import './CreateSpot.css'

import SpotForm from '../SpotForm/index'

const CreateSpotForm = () => {
  const spot = {
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
  };
  return (
    <SpotForm spot={spot} formType="Create Spot"/>
  )
};

export default CreateSpotForm;
