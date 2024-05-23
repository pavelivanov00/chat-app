'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import './register.css';

type FormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type FormErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = (): FormErrors => {
        let newErrors: FormErrors = {};

        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";

        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        return newErrors;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
          try {
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
      
            if (!response.ok) {
              throw new Error('Failed to register');
            }
      
            const result = await response.json();
            console.log('Form data submitted:', result);
            setSubmitted(true);
          } catch (error) {
            console.error('Error submitting form:', error);
          }
        } else {
          setErrors(validationErrors);
        }
      };
      
      

    return (
        <div className="registerContainer">
            <div className='register'>
                Register
            </div>
            {submitted ? (
                <div className="successMessage">Registration successful!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="formElement">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="registerUsername"
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                    </div>
                    <div className="formElement">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="registerEmail"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="formElement">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="registerPassword"
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="formElement">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="registerPassword"
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>
                    <button
                        type="submit"
                        className='registerButton'
                    >
                        Register</button>
                </form>
            )}
        </div>
    );
}