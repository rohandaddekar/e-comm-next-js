import LOADING from "@/public/assets/images/loading.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-start mt-12">
      <Image src={LOADING.src} alt="Loading..." height={80} width={80} />
    </div>
  );
};

export default Loading;
