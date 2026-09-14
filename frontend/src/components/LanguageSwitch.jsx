import { getSupportedLanguages } from "@/lib/i18n";

export default function LanguageSwitch({ value, onChange }) {
  const langs = getSupportedLanguages();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-white/10 p-1 text-xs backdrop-blur"
      data-testid="language-switch"
      role="group"
      aria-label="Language"
    >
      {langs.map((l) => {
        const active = value === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => onChange(l.code)}
            className={
              active
                ? "rounded-full bg-white px-2.5 py-1 font-medium text-black"
                : "rounded-full px-2.5 py-1 text-white/80 hover:bg-white/20 hover:text-white"
            }
            data-testid={`lang-${l.code.toLowerCase()}`}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
