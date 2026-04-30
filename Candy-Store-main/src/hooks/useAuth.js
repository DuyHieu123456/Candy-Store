// src/hooks/useAuth.js
import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;