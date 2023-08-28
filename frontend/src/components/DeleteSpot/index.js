import { useDispatch } from 'react-redux'
import './DeleteSpot.css'
import { useEffect, useRef, useState } from 'react';
import { useModal } from '../../context/Modal';
import { deleteSpots } from '../../store/spot';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const DeleteSpotModal = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = () => {
    dispatch(deleteSpots(spotId))
    .then(closeModal)

    history.push('/users/manage');
  }

  return (
    <form onSubmit={handleSubmit}>
    <div>
      <button className="RedButton" type='submit'>Yes (Delete Spot)</button>
    </div>
    <div>
      <button className="GrayButton"onClick={closeModal}>No (Keep Spot)</button>
    </div>
    </form>
  )
}

export default DeleteSpotModal;
