import { createContext, useContext, useReducer } from "react";

const initialState = null;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET":
      return {
        user: action.payload.user,
        username: action.payload.username,
        token: action.payload.token,
      };
    case "CLEAR":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
