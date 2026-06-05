export function fetchErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Tente novamente em instantes.";
}

type FetchErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
};

export function FetchError({
  title = "Erro ao carregar",
  message = "Não foi possível buscar os dados agora.",
  onRetry,
  retrying,
}: FetchErrorProps) {
  return (
    <div className="hairline border py-24 text-center px-6">
      <div className="font-display text-2xl text-bone">{title}</div>
      <p className="mt-2 text-bone-dim text-sm max-w-md mx-auto">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="mt-6 h-10 px-5 bg-acid text-pitch font-semibold text-sm hover:bg-acid-dim transition-colors disabled:opacity-60"
        >
          {retrying ? "Tentando…" : "Tentar novamente"}
        </button>
      ) : null}
    </div>
  );
}
