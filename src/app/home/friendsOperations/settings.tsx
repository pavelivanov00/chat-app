import Link from 'next/link';
import "./css/settings.css"
import { useState } from 'react';
import { ObjectId } from 'mongoose';

type SettingsProps = {
    user: string;
    userID: ObjectId
}

const Settings: React.FC<SettingsProps> = ({ user, userID }) => {
    const [toggleChangeUsername, setToggleChangeUsername] = useState<boolean>(false);
    const [toggleChangePassword, setToggleChangePassword] = useState<boolean>(false);
    const [toggleChangeEmail, setToggleChangeEmail] = useState<boolean>(false);

    const [newUsername, setNewUsername] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [oldEmail, setOldEmail] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');

    const [usernameResponse, setUsernameResponse] = useState<string>('')
    const [passwordResponse, setPasswordResponse] = useState<string>('')
    const [emailResponse, setEmailResponse] = useState<string>('')

    const handleToggleChangeUsername = () => {
        setToggleChangeUsername(prevState => !prevState);
        setToggleChangePassword(false);
        setToggleChangeEmail(false);
    };

    const handleToggleChangePassword = () => {
        setToggleChangePassword(prevState => !prevState);
        setToggleChangeUsername(false);
        setToggleChangeEmail(false);
    };

    const handleToggleChangeEmail = () => {
        setToggleChangeEmail(prevState => !prevState);
        setToggleChangeUsername(false);
        setToggleChangePassword(false);
    };

    const handleChangeUsername = async () => {
        try {
            const response = await fetch("/api/changeUsername", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentUsername: user,
                    newUsername: newUsername,
                }),
            });
            const data = await response.json();

            setUsernameResponse(data.message);
        } catch (error) {
            console.error("Error changing username:", error);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) return setPasswordResponse("Passwords do not match")
        try {
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });
            const data = await response.json();

            setPasswordResponse(data.message);
        } catch (error) {
            console.error("Error changing username:", error);
        }
    };

    const handleChangeEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail) || !emailRegex.test(oldEmail)) return setEmailResponse("Email is not valid");
        
        if (oldEmail === newEmail) return setEmailResponse("The emails are the same");

        try {
            const response = await fetch("/api/changeEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldEmail: oldEmail,
                    newEmail: newEmail,
                }),
            });
            const data = await response.json();

            setEmailResponse(data.message);
        } catch (error) {
            console.error("Error changing username:", error);
        }
    };

    return (
        <div className='settings'>
            <button
                className="settingsButton"
                onClick={handleToggleChangeUsername}
            >
                Change username
            </button>

            {toggleChangeUsername &&
                <div className='container'>
                    <input
                        type="text"
                        name="newUsername"
                        autoComplete='off'
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                        placeholder="New username"
                        className="inputField"
                    />
                    <button
                        className="settingsButton"
                        onClick={handleChangeUsername}
                    >
                        Confirm
                    </button>
                    {usernameResponse &&
                        <div
                            className={(usernameResponse === "Username changed successfully") ? "changeResponseOK" : "changeResponseFail"}>
                            {usernameResponse}
                        </div>
                    }
                </div>
            }

            <button
                className="settingsButton"
                onClick={handleToggleChangePassword}
            >
                Change password
            </button>

            {toggleChangePassword &&
                <div className='container'>
                    <input
                        type="password"
                        name="oldPassword"
                        autoComplete="new-password"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        placeholder="Old password"
                        className="inputField"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="New password"
                        className="inputField"
                    />
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm new password"
                        className="inputField"
                    />
                    <button
                        className="settingsButton"
                        onClick={handleChangePassword}
                    >
                        Confirm
                    </button>
                    {passwordResponse &&
                        <div
                            className={(passwordResponse === "Password changed successfully") ? "changeResponseOK" : "changeResponseFail"}>
                            {passwordResponse}
                        </div>
                    }
                </div>
            }

            <button
                className="settingsButton"
                onClick={handleToggleChangeEmail}
            >
                Change email
            </button>

            {toggleChangeEmail &&
                <div className='container'>
                    <input
                        type="email"
                        name="email"
                        autoComplete="new-email"
                        value={oldEmail}
                        onChange={(event) => setOldEmail(event.target.value)}
                        placeholder="Current email"
                        className="inputField"
                    />
                    <input
                        type="email"
                        name="newEmail"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        placeholder="New email"
                        className="inputField"
                    />
                    <button
                        className="settingsButton"
                        onClick={handleChangeEmail}
                    >
                        Confirm
                    </button>
                    {emailResponse &&
                        <div
                            className={(emailResponse === "Email changed successfully") ? "changeResponseOK" : "changeResponseFail"}>
                            {emailResponse}
                        </div>
                    }
                </div>
            }

            <Link href="/" className='logOut'>Log out</Link>
        </div>
    )
}

export default Settings;