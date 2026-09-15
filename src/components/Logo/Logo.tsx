import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white">
        <Image
          src="/bhumi-logo.jpg"
          alt="Bhumi Enterprise logo"
          fill
          priority
          sizes="48px"
          className="object-contain p-1"
        />
      </div>

      <div className="leading-tight">
        <p className="text-lg font-bold tracking-tight text-slate-900">
          Bhumi Enterprise
        </p>

        <p className="mt-1 text-[11px] font-medium text-slate-500">
          Tata Green, Geon &amp; Amaron Batteries
        </p>
      </div>
    </div>
  );
}