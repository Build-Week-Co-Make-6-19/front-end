import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { api } from "../utils/api";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms";

function Login(props) {
  const history = useHistory();
  const setUser = useSetRecoilState(userState);
  const [ credentialError, setCredentialError ] = useState(false)
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    // console.log('data', data);
    api()
    .post("api/login", data)
    .then((res) => {
        setUser((initial) => {
        return {
            user: res.data.data,
            loggedIn: true,
        };
        });
        localStorage.setItem("token", res.data.token);
        history.push("/userDash");
    })
    .catch((err) => {
        setCredentialError(true)
        console.log(err)
    });
  };

  return (
    <StyledLogin>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email:</label>
        <input
          name="email"
          ref={register({
            required: true,
            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          })}
        />
        {errors.email && <span>Please enter a valid email address.</span>}
        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({
            required: true,
            min: 8,
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,16}$/,
          })}
        />
        {errors.password && <span>
            Your password must be:
            <br />
            8-16 characters in length
            <br />
            Contain at least one upper case letter
            <br />
            Contain at least one lower case letter
            <br />
            Contain at least one number
          </span>}
        <div className='credentialError' style={credentialError ? {} : { display: "none" }} >It looks like you're email or password is incorrect.</div>
        <button className='submit' type="submit">Login</button>
      </form>
    </StyledLogin>
  );
};

export default Login;

const StyledLogin = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 10% auto;
    width: 40%;
    padding: 3%;
        @media(max-width:500px){
            width: 80%;
        }
    h2{
        font-size: 2rem;
        margin: 2% 0;
    }
    form{
        display: flex;
        flex-direction: column;
        input{
            padding: 2%;
            margin: 2% 0;
        }
        button.submit{
            width: 30%;
            margin: 2% auto;
            padding: 2%;
            font-size: 1rem;
        }
        button.submit:active{
            background-color: lightgrey;
        }
        div.credentialError{
            color: red;
        }
    }
`