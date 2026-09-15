"use client";

type AdminConfirmButtonProps = {
  message: string;
  children: React.ReactNode;
  className?: string;
};

export default function AdminConfirmButton({
  message,
  children,
  className = "",
}: AdminConfirmButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}