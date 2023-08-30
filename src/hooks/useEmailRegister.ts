import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "react-query";

interface RegisterData {
    email: string;
    password: string;
}

const registerEmailUser =async (data:RegisterData) => {
    const { user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
    });

    if (error)
        throw new Error(error.message);
    
    return user;
}

const useEmailRegister = () => {
    const queryClient = useQueryClient();

    return useMutation(registerEmailUser, {
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    });
}

export default useEmailRegister;
