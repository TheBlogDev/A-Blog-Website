import React, { createContext, useReducer, useEffect, type ReactNode } from "react";   

interface User {
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: any;
}

export const AuthContext = createContext<{
  user: User | null;
  dispatch: React.Dispatch<AuthAction>
}>({
  user : null, 
  dispatch: () => {},
});

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {

      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (user && 
        typeof user.email === "string" &&
        typeof user.token === "string"
      ) {
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (err) {
      console.log("Failed to parse user from localStorage")
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
