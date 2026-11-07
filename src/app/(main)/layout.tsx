import NavBar from "@/components/nav-bar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <NavBar />
        <main className="mx-auto w-full max-w-5xl px-6 py-8">
            {children}

        </main>
        </>
        )
}

    
    