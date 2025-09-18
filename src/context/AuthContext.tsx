import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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
  dispatch: React.Dispatch<AuthAction>;
  authIsLoading: boolean;
}>({
  user: null,
  dispatch: () => {},
  authIsLoading: false,
});

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
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

  const [authIsLoading, setAuthIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {

      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (user && typeof user.email === "string") {
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (err) {
      console.log("Failed to parse user from localStorage");
    } finally {
      setAuthIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, authIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
