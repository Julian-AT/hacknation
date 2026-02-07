
'use client';

const SUGGESTED_QUERIES = [
  // Exploration
  "How are hospitals distributed across Ghana's regions?",
  "Which facilities offer cataract surgery?",
  "Find hospitals within 50km of Tamale",
  "What eye care exists in Northern Region?",
  
  // Analysis
  "Where are the medical deserts for emergency care?",
  "Which facilities have suspicious capability claims?",
  "What specialties have only 1-2 facilities in Ghana?",
  "I'm an ophthalmologist — where should I volunteer?"
];

export function SuggestedQueries({ append }: { append: (message: any) => void }) {
  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
      <div className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Suggested Queries</div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => append({ role: 'user', content: query })}
            className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors text-left"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
