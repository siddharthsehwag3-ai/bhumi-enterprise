"use client";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f4f8f5",
          color: "#0f172a",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "560px",
            padding: "48px 32px",
            textAlign: "center",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            boxShadow:
              "0 20px 50px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "22px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            !
          </div>

          <p
            style={{
              marginTop: "28px",
              marginBottom: 0,
              color: "#047857",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Bhumi Enterprise
          </p>

          <h1
            style={{
              marginTop: "16px",
              marginBottom: 0,
              fontSize: "36px",
              lineHeight: 1.15,
            }}
          >
            The website could not load
          </h1>

          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "430px",
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            A temporary technical problem occurred. Please try
            loading the website again.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "30px",
              minHeight: "48px",
              padding: "12px 24px",
              border: 0,
              borderRadius: "12px",
              background: "#059669",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>

          {error.digest && (
            <p
              style={{
                marginTop: "24px",
                marginBottom: 0,
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}