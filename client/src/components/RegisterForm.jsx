import AuthForm from "./AuthForm";

export default function RegisterForm() {
  return (
    <AuthForm
      endpoint="/api/v1/auth/register"
      method="POST"
      title="Register"
      actionName="Register"
      options={{ redirectIfUser: true, redirectOnOk: true }}
      inputs={
        <>
          <label>
            Username:
            <input type="text" name="username" id="username" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" id="email" required />
          </label>
          <label>
            Password:
            <input type="password" name="password" id="password" required />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
            />
          </label>
        </>
      }
    />
  );
}
