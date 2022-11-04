import Layout from "components/Layout";
import useUser from "lib/useUser";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: "/login" });

  const [show, setShow] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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

  const nowTime = (today: Date) => {
    return (
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    );
  };

  return (
    <div>
      <Layout>
        <h4>{greetings(new Date())}, Carlos</h4>
        <h5>Agora são: {nowTime(date)}</h5>
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
