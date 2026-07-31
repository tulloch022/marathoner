import { useEffect, useState, type ReactNode } from "react";
import { logOut, subscribeToAuthState } from "../services/authService";
import { AuthContext, type AuthSession } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>({
    status: "loading",
    user: null,
  });

  useEffect(
    () =>
      subscribeToAuthState(
        (user) => {
          setSession(
            user
              ? { status: "signedIn", user }
              : { status: "signedOut", user: null },
          );
        },
        () => {
          setSession({ status: "signedOut", user: null });
        },
      ),
    [],
  );

  return (
    <AuthContext.Provider value={{ ...session, logout: logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
