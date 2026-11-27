import { useState } from "react";
import { useOutletContext } from "react-router";
import AuthForm from "./AuthForm";

export default function Settings() {
  const { user } = useOutletContext();
  const [type, setType] = useState("profile"); // "profile" or "auth"
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(user?.userProfile?.username || "");
  const [bio, setBio] = useState(user?.userProfile?.bio || "");

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setEmail(user?.email || "");
    setUsername(user?.userProfile?.username || "");
    setBio(user?.userProfile?.bio || "");
  }

  function onEmailChange(e) {
    setEmail(e.currentTarget.value);
  }
  function onPasswordChange(e) {
    setPassword(e.currentTarget.value);
  }
  function onConfirmPasswordChange(e) {
    setConfirmPassword(e.currentTarget.value);
  }
  function onUsernameChange(e) {
    setUsername(e.currentTarget.value);
  }
  function onBioChange(e) {
    setBio(e.currentTarget.value);
  }

  const form =
    type === "profile" ? (
      <AuthForm
        endpoint={`/api/v1/profiles/${user?.id}`}
        method="PATCH"
        title="Profile"
        actionName="Save"
        options={{ redirectIfUser: false, redirectOnOk: false }}
        inputs={
          <>
            <label>
              Username:
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={onUsernameChange}
                maxLength="25"
              />
              {username?.length}/25
            </label>
            <label>
              Bio:
              <textarea
                name="bio"
                id="bio"
                value={bio}
                onChange={onBioChange}
                rows="10"
                cols="40"
                maxLength="150"
              />
              {bio?.length}/150
            </label>
          </>
        }
      />
    ) : (
      <AuthForm
        endpoint="/api/v1/auth/me"
        method="PATCH"
        title="Security"
        actionName="Save"
        options={{ redirectIfUser: false, redirectOnOk: false }}
        inputs={
          <>
            <label>
              Email:
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onEmailChange}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={onPasswordChange}
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
              />
            </label>
          </>
        }
      />
    );

  const onTypeChange = (e) => setType(e.currentTarget.value);

  return (
    <>
      <fieldset>
        <legend>Settings:</legend>
        <label>
          <input
            type="radio"
            name="type"
            id="profile"
            value="profile"
            checked={type === "profile"}
            onChange={onTypeChange}
          />
          Profile
        </label>
        <label>
          <input
            type="radio"
            name="type"
            id="security"
            value="security"
            checked={type === "security"}
            onChange={onTypeChange}
          />
          Security
        </label>
      </fieldset>

      {form}
    </>
  );
}
