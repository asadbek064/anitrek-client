import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface RegisterData {
    email: string;
    password: string;
}

const registerEmailUser =async (data:RegisterData) => {    
    const { user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
    });

    if (error) {
        toast.error(`${error.message}`, { position: 'top-center', autoClose: 2000, toastId:5 });
        throw new Error(error.message);
    }
    
    return user;
}

const useEmailRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation(registerEmailUser, {
        onSuccess: () => {
            queryClient.invalidateQueries();

            router.replace({ pathname: '/home'});
        }
    });
}

export default useEmailRegister;
