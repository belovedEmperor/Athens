import { useOutletContext } from "react-router";

export default function Home() {
  const { user } = useOutletContext();

  return (
    <div>
      {!user ? (
        <>
          <p>Looks like you're not logged in!</p>
          <a href="/auth/login">Login</a>
        </>
      ) : (
        <a href="/levels">Level Selector</a>
      )}
    </div>
  );
}
