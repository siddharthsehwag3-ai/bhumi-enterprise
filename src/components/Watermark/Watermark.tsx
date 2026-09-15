import Image from "next/image";

export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-5 flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/bhumi-logo-transparent.png"
        alt=""
        width={800}
        height={800}
        priority
        className="h-[min(68vw,650px)] w-[min(68vw,650px)] object-contain opacity-[0.55]"
      />
    </div>
  );
}