import Head from "next/head";
import LandPage from "./views/dashboard/LandPage";

export default function Home() {
  return (
    <div className="w-100">
      <Head>
        <title>LaserTrader Page</title>
        <meta name="description" content="ThelaserTrader by Sentient" />
        
      </Head>
      <div className="w-100">
        <LandPage>
        
        </LandPage>
      </div>
    </div>
  );
}
