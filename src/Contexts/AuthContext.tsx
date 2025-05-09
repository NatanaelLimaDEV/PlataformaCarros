import { onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../Services/firebaseConnection";

interface AuthProviderProps {
    children: ReactNode
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ({ uid, name, email }: UseProps) => void;
    user: UseProps | null;
}

interface UseProps {
    uid: string;
    name: string | null;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UseProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email,
                })

                setLoadingAuth(false)
            } else {
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            unsub()
        }

    }, [])

    function handleInfoUser({ uid, name, email }: UseProps){
        setUser({
            name,
            email,
            uid,
        })
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            loadingAuth,
            handleInfoUser,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider