'use client'
import React, { useState, ChangeEvent } from 'react';
import './register.css';
import Link from 'next/link';

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
    emailTaken?: string;
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

                const result = await response.json();
                if (result.message === "Email already exists") setErrors({
                    emailTaken: "Email already exists"
                });

                if (!response.ok) {
                    throw new Error('Failed to register');
                }

                setSubmitted(true);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        } else {
            setErrors({
                username: validationErrors.username,
                email: validationErrors.email,
                password: validationErrors.password,
                confirmPassword: validationErrors.confirmPassword,
            });
        }
    };

    return (
        <div className="registerContainer">
            <div className='registerHeading'>
                Register
            </div>
            {submitted ? (
                <>
                    <div className="successMessage">Registration successful!</div>
                    <div className="loginMessage">
                        You can now log in <Link href="/">here.</Link>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className='registerForm'>
                    <div className="formElement">
                        <input
                            type="text"
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="registerEmail"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                        {errors.emailTaken && <span className="error">{errors.emailTaken}</span>}
                    </div>
                    <div className="formElement">
                        <input
                            type="password"
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
                        Register
                    </button>
                </form>
            )}
        </div>
    );
}