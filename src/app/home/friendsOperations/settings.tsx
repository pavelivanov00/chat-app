import Link from 'next/link';
import "./css/settings.css"
import { ChangeEvent, useState } from 'react';
import { ObjectId } from 'mongoose';

type SettingsProps = {
    user: string;
    userID: ObjectId
}

const Settings: React.FC<SettingsProps> = ({ user, userID }) => {
    const [toggleChangeUsername, setToggleChangeUsername] = useState<boolean>(false);
    const [toggleChangePassword, setToggleChangePassword] = useState<boolean>(false);

    const [newUsername, setNewUsername] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [response, setResponse] = useState<string>('')
    const handleToggleChangeUsername = () => {
        setToggleChangeUsername(prevState => !prevState);
        setToggleChangePassword(false);
    };

    const handleToggleChangePassword = () => {
        setToggleChangePassword(prevState => !prevState);
        setToggleChangeUsername(false);
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

            setResponse(data.message);
            console.log(response);
        } catch (error) {
            console.error("Error changing username:", error);
        }
    }

    const handleChangePassword = async () => {

    }

    return (
        <div className='settings'>
            <button
                className="settingsButton"
                onClick={handleToggleChangeUsername}
            >
                Change username
            </button>

            {toggleChangeUsername &&
                <div className='changeUsernameContainer'>
                    <input
                        type="text"
                        name="newUsername"
                        autoComplete='off'
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                        placeholder="New username"
                        className="changeUsernameInput"
                    />
                    <button
                        className="settingsButton"
                        onClick={handleChangeUsername}
                    >
                        Confirm
                    </button>
                    {response &&
                        <div>
                            {response}
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
                <div className='changePasswordContainer'>
                    <input
                        type="password"
                        name="oldPassword"
                        autoComplete="new-password"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        placeholder="Old password"
                        className="changePasswordInput"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="New password"
                        className="changePasswordInput"
                    />
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm new password"
                        className="changePasswordInput"
                    />
                    <button
                        className="settingsButton"
                        onClick={handleChangePassword}
                    >
                        Confirm
                    </button>
                </div>
            }
            <Link href="/" className='logOut'>Log out</Link>
        </div>
    )
}

export default Settings;