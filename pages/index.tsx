import Layout from "components/Layout";
import useUser from "lib/useUser";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: "/login" });

  const [show, setShow] = useState(true);

  if (!user || user.isLoggedIn == false) {
    return <div>loading...</div>;
  }

  const handleClick = () => {
    setShow(!show);
  };

  const greetings = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return "Bom dia";
    else if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div>
      <Layout>
        <h4>{greetings(new Date())}, Carlos</h4>
        <div className="grid content-center py-4">
          {show ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleClick}
            >
              Marcar ponto
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleClick}
            >
              Fechar ponto
            </button>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
