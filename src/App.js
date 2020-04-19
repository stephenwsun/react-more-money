import React, { useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import "./App.css";

const App = () => {
  const onSuccess = useCallback(async (token, metadata) => {
    // send token to server
    console.log(`Token: ${token}`);
    const data = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: token })
    });
    const json = await data.json();
    console.log(`Access token: ${json.access_token}`);
  }, []);

  const config = {
    clientName: "More Money",
    env: "sandbox",
    product: ["auth", "transactions"],
    publicKey: "aa41d2677d293ac2352aee21491d61",
    onSuccess
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <div onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </div>
  );
};
export default App;
