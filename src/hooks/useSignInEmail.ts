import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

interface UseSignInWithEmailOptions {
  redirectTo?: string;
}

const useSignInWithEmail = (options?: UseSignInWithEmailOptions) => {

  const router = useRouter();

  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const { user, error } = await supabase.auth.signIn({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        return user;
      } catch (error) {
        throw new Error("An error occurred while signing in");
      }
    },
    {
      onSuccess: (user) => {
        // Perform any actions after successful sign-in, like redirecting
        if (options?.redirectTo && !options.redirectTo?.includes("/")) {
          router.replace({pathname: options.redirectTo});
        } else {
          router.replace({pathname: "/"});
        }
      },
    }
  );
};

export default useSignInWithEmail;
