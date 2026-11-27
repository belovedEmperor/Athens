import AuthForm from "./AuthForm";

export default function LoginForm() {
  return (
    <AuthForm
      endpoint="/api/v1/auth/login"
      method="POST"
      title="Login"
      actionName="Login"
      options={{ redirectIfUser: true, redirectOnOk: true }}
      inputs={
        <>
          <label>
            Email:
            <input type="email" name="email" id="email" required />
          </label>
          <label>
            Password:
            <input type="password" name="password" id="password" required />
          </label>
        </>
      }
    />
  );
}
