import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { Link } from "react-router-dom";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  }

  const ulClassName = "loginList" + (showMenu ? "" : " hidden");

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <div>
        <button onClick={openMenu}>
          <i className="fas fa-user-circle" />
        </button>
        <li className={ulClassName} ref={ulRef}>
          <div>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          </div>
          <div>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
          </div>
        </li>
      </div>

    );
  }

  let newSpot;
  if(sessionUser) {
    newSpot =  (
      <a href='/spots/new'>
        <button>Create a New Spot</button>
      </a>
    )
  }



  useEffect(() => {
    if(!showMenu) return;
    const closeMenu = (e) => {
      if(!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <div className='dropdown'>
      {isLoaded && newSpot}
      <ul>
        {isLoaded && sessionLinks}
      </ul>
    </div>
  );
}

export default Navigation;
