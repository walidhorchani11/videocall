import React, { createContext, useEffect, useMemo, useCallback, useReducer } from 'react';
import { LOGIN, LOGOUT, RESTORE, authReducer } from 'reducers/AuthReducer';
import EncryptedStorage from 'react-native-encrypted-storage';


// creation context
// depuis ce context , je vais l utiliser pour recuperer shared val avec useContext
// creation du provider aussi
export const AuthContext = createContext(null);

// TODO mettre ca comme const externe for multiple use
const USER_SESSION = "user_session";

var initialState = {
  isLoading: true,
  token: null,
  isLogued: false,
}

const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(async () => {
    await EncryptedStorage.removeItem(USER_SESSION);
    dispatch({ type: LOGOUT });
  }, []);

  const login = useCallback((token) => {
    if (token) {
      setToken(token);
      // save new token to secure storage
    }
  }, [])

  // access to secure storage to get token, once at first render
  useEffect(() => {
    console.log('i am here balizzz -----------------------------')
    // creer une fct asyn to get value token from storage
    const fetchToken = async () => {
      try {
        const token = await EncryptedStorage.getItem(USER_SESSION);
        if (token) {
          // si il ya token dans le storage , on le prend et on update le state,
          // TODO check si token is valide yet
          dispatch({ type: RESTORE, payload: { token } });
        }
      } catch (error) {
        console.log('failed get token from storage ---------------------------------', error);
      }
    }

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }