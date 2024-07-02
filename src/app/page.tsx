'use client';
import Link from 'next/link';
import './home.css';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation'

type loginFormData = {
  email: string;
  password: string;
}

type loginFormErrors = {
  email?: string;
  password?: string;
  wrongCredentials?: string;
}

export default function Login() {

  const [loginData, setLoginData] = useState<loginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<loginFormErrors>({});
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const validate = (): loginFormErrors => {
    let newErrors: loginFormErrors = {};

    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (result.message === "Wrong email or password") {
          setErrors({
            wrongCredentials: "Wrong email or password"
          });
        }
        else router.push('/home');

        if (!response.ok) {
          throw new Error('Failed to login');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      setErrors({
        email: validationErrors.email,
        password: validationErrors.password,
      });
      console.log(errors);
    }
  };

  return (
    <>
      <div className="infoContainer">
        You can test the app by either creating a new account or use this one:
        <br />
        email: example@email.com
        <br />
        pass: 1234
        <br />
        The websocket live chatting can be tested with two accounts each of them logged in a browser tab. Here is another:
        <br />
        email: fred@yahoo.com
        <br />
        pass: 1234
        <br />
        <br />
        Technologies and libraries used: Next.js, TypeScript, MongoDB (with mongoose), WebSocket, FontAwesome.
        <br /> 
        The communication between the front-end and the back-end is handled by using HTTP methods through API calls.  
      </div>
      <div className="loginContainer">
        <div className='welcomeHeading'> Welcome to Chatter.</div>
        <div className='welcomeHeading marginBottom'>Start by logging in.</div>

        <form onSubmit={handleLogin} className="loginForm">
          <div className="loginFormElement">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="loginEmail"
              onChange={handleChange}
            />
            {errors.email && <span className="errorLogin">{errors.email}</span>}
          </div>
          <div className="loginFormElement">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="loginPassword"
              onChange={handleChange}
            />
            {errors.password && <span className="errorLogin">{errors.password}</span>}
            {errors.wrongCredentials && <span className="errorLogin">{errors.wrongCredentials}</span>}
          </div>
          <button type="submit" className="loginButton">Log in</button>
        </form>

        <div className="registerHere">
          Don't have an account? <Link href="/register">Sign up here.</Link>
        </div>
      </div>
    </>
  );
}
