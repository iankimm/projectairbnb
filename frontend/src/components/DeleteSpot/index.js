import { useDispatch, useSelector } from 'react-redux'
import './DeleteSpot.css'
import { useModal } from '../../context/Modal';
import { deleteImages, deleteSpots } from '../../store/spot';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchImageById } from '../../store/image';
import { useEffect } from 'react';

const DeleteSpotModal = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const images = useSelector(state => state.currentSpot.SpotImages)

  const handleSubmit = () => {
    dispatch(fetchImageById(spotId))
    for(let i = 0; i < images.length; i++){
      dispatch(deleteImages(images[i].id))
    }
    dispatch(deleteSpots(spotId))
    .then(closeModal)
    history.push('/users/manage');
  }

  useEffect(() => {
    dispatch(fetchImageById(spotId))
  },[dispatch])

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
