import { FormEvent, useState } from "react";
import { useSubscribe } from "../hooks/useSubscribe.tsx";

export default function Subscribe() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { subscribe, error, isLoading } = useSubscribe();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      await subscribe(email, password);
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Subscribe</h3>
      <label>Email:</label>
      <input
        type="email"
        autoComplete="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        autoComplete="current-password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        value={password}
      />
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Subscribe"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};