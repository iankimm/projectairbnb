// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState('');
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = 'The provided credentials were invalid'
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(typeof data);
        if (data && (typeof data === 'object')) {
          setErrors(errorMsg);
        }
        console.log('errors', errors)
      });
  };

  const demoLogin = () => {
    const demoId = 'iankimm';
    const demoPw = 'password';

    return dispatch(sessionActions.login({ credential: demoId, password: demoPw }))
      .then(closeModal)
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.length > 3 && (
          <p>{errors}</p>
        )}
        <button type="submit"
        disabled={credential.length < 4 || password.length < 6}>
          Log In
        </button>
        <button onClick={demoLogin}>Log in as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
