import SymptomsForm from "../components/SymptomsForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="main">
      <h1 className="main__title">H.A.D.I (Health and Disease Identification)</h1>
      <div className="main__image-container">
        <Image src="/qr.png" alt="QR Code" width={200} height={200} priority />
      </div>
      <SymptomsForm />
    </main>
  );
}
