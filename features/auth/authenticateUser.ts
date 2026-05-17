import { useAuthStore } from "./authStore";

export default function createUserContext(user: any) {
    const { setUser, isAuthenticated, user: authUser } = useAuthStore();
    if (authUser) return;
    setUser({
        name: user.name,
        email: user.email,
        id: user.id,
        avatar: user.avatar,
    });


    return {
        authUser,
        isAuthenticated,
    };



}