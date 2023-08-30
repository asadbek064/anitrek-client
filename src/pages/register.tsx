import useEmailRegister from "@/hooks/useEmailRegister";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";

interface RegisterComponentProps {

}

const RegisterComponent: React.FC<RegisterComponentProps> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const registerMutation = useEmailRegister(); 
    const { t } = useTranslation("register");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          await registerMutation.mutateAsync({ email, password });
        } catch (error) {
        }
      };

    return (
        <>
        <div className="mt-24 relative col-span-3 xl:col-span-2 bg-background flex items-center justify-center bg-transparent">
            <div className="w-full px-4 md:px-0">
                <h1 className="text-5xl font-bold mb-8">{t("register_heading")}</h1>
                <div className="flex items-center justify-centerrounded-sm py-4 md:flex-row-reverse flex-col">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white-100">
                            Email
                            </label>
                            <input
                            type="email"
                            className="tracking-wide text-lg mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white-100">
                            Password
                            </label>
                            <input
                            type="password"
                            className="text-lg mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row justify-between my-2 py-2">
                            <Link
                                href={"/forgot-password"}
                            >
                            <a className="text-white text-lg hover:text-red-500 ease-in transition-all duration-75">Forgot password?</a>
                            </Link>
                            <Link
                                href={"/register"}
                            >
                                <a className="text-white text-lg hover:text-red-500 ease-in transition-all duration-75">Register</a>
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="ease-in duration-100 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-sm"
                            disabled={registerMutation.isLoading}
                        >
                            {registerMutation.isLoading ? "Signing in..." : "Sign In"}
                        </button>
                        </form>
                </div>
            </div>
        </div>

        </>
    )
}


export default RegisterComponent;

