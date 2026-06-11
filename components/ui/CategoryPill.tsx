interface CategoryPillProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ category, isActive = false, onClick }: CategoryPillProps) {
  if (isActive) {
    return (
      <button 
        onClick={onClick}
        className="whitespace-nowrap px-5 py-2 rounded-full bg-nordic-dark text-white text-sm font-medium shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5"
      >
        {category}
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5"
    >
      {category}
    </button>
  );
}
