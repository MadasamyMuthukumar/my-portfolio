import { useState } from 'react';

/**
 * Proves the React integration hydrates end to end. Lives only on
 * /stack-check so the real pages never pay for the React runtime.
 * Phase 2 replaces this with components that genuinely need state.
 */
export default function ReactProbe() {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      className="border-border text-step-s text-muted hover:text-fg rounded-md border px-3 py-1.5 transition-colors"
    >
      Hydrated clicks: {count}
    </button>
  );
}
