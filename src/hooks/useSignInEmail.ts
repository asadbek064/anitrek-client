import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";

interface UseSignInWithEmailOptions {
  redirectTo?: string;
}

const useSignInWithEmail = (options?: UseSignInWithEmailOptions) => {
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
        if (options?.redirectTo) {
          // Redirect logic here
        }
      },
    }
  );
};

export default useSignInWithEmail;
