import { useState } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { getUser, logout } from "./lib/auth.js";
import { Chat } from "./components/Chat.js";
import { LoginForm } from "./components/LoginForm.js";
import { NavBar } from "./components/NavBar.js";
import { apolloClient } from "./lib/graphql/client.js";

export const App = () => {
  const [user, setUser] = useState(getUser);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <ApolloProvider client={apolloClient}>
      <header>
        <NavBar user={user} onLogout={handleLogout} />
      </header>

      <main>
        {user ? <Chat user={user} /> : <LoginForm onLogin={setUser} />}
      </main>
    </ApolloProvider>
  );
}