import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { CreateTodo } from "~/components/CreateTodo";
import { Todos } from "~/components/Todos";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cyan-800 to-emerald-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {sessionData && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                <h3 className="text-xl font-bold">Todos</h3>
                <Todos />
                <CreateTodo />
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-l text-center text-white">
              {sessionData && (
                <span>Logged in as {sessionData.user.email}</span>
              )}
            </p>
            <button
              onClick={sessionData ? () => void signOut() : () => void signIn()}
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              {sessionData ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
