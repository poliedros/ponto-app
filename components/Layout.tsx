import Head from "next/head";
import { Navbar } from "./Navbar";

export default function Layout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string | undefined;
}) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | CZAR+` : "CZAR+"}</title>
        <meta
          name="description"
          content="Ponto CZAR+. Created with ❤ by czar.dev"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto">
        <div>{children}</div>
      </main>
    </>
  );
}
