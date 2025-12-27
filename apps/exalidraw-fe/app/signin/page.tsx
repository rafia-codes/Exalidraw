import { AuthPage } from "@/components/AuthPage"

export function SignIn(){
    return (
        <div>
            <AuthPage isSignIn={true}></AuthPage>
        </div>
    )
}