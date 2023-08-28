import './DeleteReview.css'

import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { deleteReview } from '../../store/review';

const DeleteReviewModal = ({reviewId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = () => {
    dispatch(deleteReview(reviewId))
    .then(closeModal)
  }

  return (
    <form onSubmit={handleSubmit}>
    <div>Confirm Delete</div>
    <div>Are you sure you want to delte this review?</div>
    <div>
      <button className="RedButton" type='submit'>Yes (Delete Review)</button>
    </div>
    <div>
      <button className="GrayButton"onClick={closeModal}>No (Keep Review)</button>
    </div>
    </form>
  )
}

export default DeleteReviewModal;
