export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-xl font-bold">
                    SaaS Pyme - Bienvenido
                </p>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Gestión Operativa B2B</h1>
                <p className="text-gray-500">Inicializando sistema...</p>
            </div>
        </main>
    );
}
