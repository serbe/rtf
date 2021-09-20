import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  // SetStateAction,
  useContext,
  useReducer,
} from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

import { User } from "../models/user";
import { clearStorage, getStorage, setStorage } from "./storage";

// const loginURL = process.env.REACT_APP_LOGINURL || "/go/login";
// const checkURL = process.env.REACT_APP_CHECKURL || "/go/check";

export interface CheckResponse {
  r: boolean;
}

export type AuthState = {
  user: User;
  login: boolean;
  check: boolean;
};

const initialAuthState: AuthState = {
  user: { role: 0, name: "", token: "" },
  login: false,
  check: false,
};

export type ReducerActions =
  | {
      type: "SetAuth";
      data: AuthState;
    }
  | {
      type: "ClearAuth";
    }
  | {
      type: "SetLogin";
      data: boolean;
    }
  | {
      type: "Checked";
    }
  | {
      type: "Unchecked";
    };

interface SetAuthState {
  dispatch: Dispatch<ReducerActions>;
}

export interface LoginResponse {
  t: string;
  r: number;
}

const initialSetAuthState: SetAuthState = {
  dispatch: () => {
    return true;
  },
};

export const login = (
  name: string,
  pass: string,
  sendJsonMessage: SendJsonMessage
): void => {
  sendJsonMessage({ u: name, p: btoa(pass) });
};

export const getLoginResponse = (
  setAuth: Dispatch<ReducerActions>,
  user: User
): void => {
  setAuth({
    type: "SetAuth",
    data: {
      user: user,
      check: true,
      login: true,
    },
  });
};

export const check = (
  token: string,
  role: string,
  sendJsonMessage: SendJsonMessage
): void => {
  sendJsonMessage({ t: token, r: role });
};

export const getCheckResponse = (response: CheckResponse): boolean => {
  return response.r;
};

export const logout = (): void => {
  clearStorage();
};

export const AuthContext = createContext(initialAuthState);

export const SetAuthContext = createContext(initialSetAuthState);

interface AuthProviderProperties {
  children: ReactNode;
}

export const reducer = (
  authState: AuthState,
  action: ReducerActions
): AuthState => {
  switch (action.type) {
    case "SetAuth": {
      setStorage(action.data.user);
      return {
        user: action.data.user,
        login: action.data.login,
        check: action.data.check,
      };
    }
    case "ClearAuth": {
      clearStorage();
      return {
        user: { role: 0, name: "", token: "" },
        login: false,
        check: true,
      };
    }
    case "SetLogin": {
      return {
        ...authState,
        login: action.data,
        check: true,
      };
    }
    case "Checked": {
      return {
        ...authState,
        check: true,
      };
    }
    case "Unchecked": {
      return {
        ...authState,
        check: false,
      };
    }
    default:
      return authState;
  }
};

export const AuthProvider = (
  properties: AuthProviderProperties
): ReactElement => {
  const { children } = properties;

  const user = getStorage();
  const initState: AuthState = {
    user,
    login: false,
    check: false,
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const setState: SetAuthState = { dispatch };

  // const contentValues = useMemo(
  //   () => ({
  //     state,
  //     dispatch,
  //   }),
  //   [state, dispatch],
  // );

  return (
    <AuthContext.Provider value={state}>
      <SetAuthContext.Provider value={setState}>
        {children}
      </SetAuthContext.Provider>
    </AuthContext.Provider>
  );
};

interface AuthContextProperties {
  auth: AuthState;
  setAuth: Dispatch<ReducerActions>;
}

export const useAuthState = (): AuthContextProperties => {
  const auth = useContext(AuthContext);
  const setter = useContext(SetAuthContext);
  return { auth, setAuth: setter.dispatch };
};
