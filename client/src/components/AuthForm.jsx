import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

export default function AuthForm({
  endpoint,
  method,
  title,
  actionName,
  inputs,
  options: { redirectIfUser = true, redirectOnOk = true },
}) {
  const { user, setUser } = useOutletContext();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  if (redirectIfUser === true) {
    if (user) navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const oldUser = user;
    setUser(undefined);

    const res = await fetch(endpoint, {
      credentials: "include",
      method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });

    if (res.ok) {
      const text = await res.text();
      if (text) setUser(JSON.parse(text));
      else setUser(oldUser);
      if (redirectOnOk === true) navigate("/");
    } else {
      setUser(user || null);
      setErrors((await res.json()).errors ?? `${actionName} failed`);
    }
  }

  return (
    <>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        {inputs}
        <button type="submit" disabled={user === undefined}>
          {user === undefined ? "Loading..." : actionName}
        </button>
      </form>
      {errors && (
        <ul>
          {errors.map((err) => (
            <li key={crypto.randomUUID()}>{err.msg}</li>
          ))}
        </ul>
      )}
    </>
  );
}
