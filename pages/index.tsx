import Layout from "components/Layout";
import { Spinner } from "components/Spinner";
import useUser from "lib/useUser";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { WorkingResponse } from "./api/working";
import { ToastContainer, toast } from "react-toastify";

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: "/login" });
  const { data, error } = useSWR<WorkingResponse>(user ? "api/working" : null);

  const [loading, setLoading] = useState<boolean>(false);
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

  if (error)
    return (
      <Layout>
        <div>failed to load</div>
      </Layout>
    );
  if (!data)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const handleClick = async () => {
    setLoading(true);
    await fetch("api/track", {
      method: "POST",
      body: JSON.stringify({ date }),
    });
    setLoading(false);
    data.working = !data.working;
    toast.success("Horário registrado com sucesso!");
  };

  const greetings = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return "Bom dia";
    else if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const nowTime = (today: Date) => {
    let minutes = "00";
    let seconds = "00";

    if (today.getSeconds() < 10) {
      seconds = "0" + today.getSeconds();
    } else {
      seconds = `${today.getSeconds()}`;
    }
    if (today.getMinutes() < 10) {
      minutes = "0" + today.getMinutes();
    } else {
      minutes = `${today.getMinutes()}`;
    }

    return today.getHours() + ":" + minutes + ":" + seconds;
  };

  function upperCaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div>
      <Layout title="PONTO">
        <h4>
          {greetings(new Date())}, {upperCaseFirstLetter(user.username)}
        </h4>
        <h5>Agora são: {nowTime(date)}</h5>
        <div className="grid content-center py-4">
          {loading ? (
            <Spinner />
          ) : !data.working ? (
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
      <ToastContainer />
    </div>
  );
};

export default Home;
