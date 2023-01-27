import Layout from "components/Layout";
import { Spinner } from "components/Spinner";
import useUser from "lib/useUser";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { WorkingResponse } from "./api/working";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import fetchJson from "lib/fetchJson";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const { user, mutateUser } = useUser({ redirectTo: "/login" });

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

  const decodedToken = jwt_decode<{ exp: number; iat: number }>(user.token);
  const epochTimeNowInSeconds = Math.round(Date.now() / 1000);
  if (decodedToken.exp < epochTimeNowInSeconds) {
    mutateUser(fetchJson("/api/logout", { method: "POST" }), false);
    router.push("/");
    return <>Recarregue a pagina.</>;
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
    try {
      const res = await fetch("api/track", {
        method: "POST",
        body: JSON.stringify({ date }),
      });

      if (res.status != 201) {
        throw new Error("something not good");
      }

      setLoading(false);
      data.working = !data.working;
      toast.success("Horário registrado com sucesso!");
    } catch (err) {
      setLoading(false);
      toast.error("Algo deu errado. Avise ao administrador");
    }
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
        <h1 className="font-medium leading-tight text-3xl mt-0 mb-2">
          {greetings(new Date())}, {upperCaseFirstLetter(user.username)}
        </h1>
        <h2 className="font-medium leading-tight text-2xl mt-0 mb-2">
          Agora são: {nowTime(date)}
        </h2>
        <div className="grid content-center py-4">
          {loading ? (
            <Spinner />
          ) : !data.working ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"
              onClick={handleClick}
            >
              Marcar ponto
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
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
