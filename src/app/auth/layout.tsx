import { Toaster } from "sonner"


export default function AuthLayout({ children }: { children: React.ReactNode }){
    return(
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
                {children}
                <Toaster position= "top-center" />
            </div>
        </main>
    )
}