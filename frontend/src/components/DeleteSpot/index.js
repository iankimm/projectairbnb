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
  //const history = useHistory();

  const images = useSelector(state => state.currentSpot.SpotImages)
  console.log(spotId);
  //needs fix
  const handleSubmit = () => {
    // dispatch(fetchImageById(spotId))
    images.forEach(image => {
      dispatch(deleteImages(image.id))
      .then(() => dispatch(deleteSpots(spotId)))
    })
    dispatch(deleteSpots(spotId))
    // .catch((error) => {
    //   console.log('ERRORRRRRR', error)
    // })
    // history.push('/users/manage');
  }

  useEffect(() => {
    dispatch(fetchImageById(spotId))
  },[])

  return (
    <form>
      <title>Are you sure you want to remove this spot?</title>
      <div>Are you sure you want to remove this spot?</div>
      <div>
        <button className="RedButton" onClick={handleSubmit}>Yes (Delete Spot)</button>
      </div>
      <div>
        <button className="GrayButton"onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </form>
  )
}

export default DeleteSpotModal;
