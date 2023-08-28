import './AllSpot.css'

import React from "react";
import { Link } from 'react-router-dom';

import { fetchSpots } from '../../store/spot';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SpotIndexItem from '../SpotIndexItem';

const SpotIndex = () => {
  const spots = useSelector(state => Object.values(state.spots))
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpots(spots))
  }, [dispatch])

  return (
    <section>
      <div className="spotContainer">
      {
      spots.map((spot) => (
        <SpotIndexItem spot={spot} key={spot.id}/>
      ))
      }
      </div>
    </section>
  )
}

export default SpotIndex;
