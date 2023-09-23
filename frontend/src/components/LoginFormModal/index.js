// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function LoginFormModal() {
  const history = useHistory();
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
      })
      .then(history.push('/'));

  };

  const demoLogin = () => {
    const demoId = 'iankimm';
    const demoPw = 'password';
    return dispatch(sessionActions.login({ credential: demoId, password: demoPw }))
      .then(closeModal)
      .then(history.push('/'))
  }

  return (
    <div className="loginform">
      <h1 className='loginformheader'>Log In</h1>
      {errors.length > 3 && (
            <p className="errorMsg">{errors}</p>
          )}
      <form onSubmit={handleSubmit} className="loginformform">
        <div className="example">
          <label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Username or Email"
              required
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>
        </div>
        <div>

          <button type="submit"
          disabled={credential.length < 4 || password.length < 6}>
            Log In
          </button>
        </div>
        <div>
          <button onClick={demoLogin}>Log in as Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
