import { Metadata } from "next";
import HomePage from "./(home)/home/page";

export const metadata: Metadata = {
  title: "Noir: Clothing Brand",
  description: "Noir: Clothing Brand.",
};

export default function Home() {
  return (
    <div>
      <main>
        <HomePage />
      </main>
    </div>
  );
}
