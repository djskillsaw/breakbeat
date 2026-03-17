export default function RefreshButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={styles.button}
      aria-label="Refresh charts"
      title="Refresh charts"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          animation: isLoading ? 'spin 1s linear infinite' : 'none',
        }}
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

const styles = {
  button: {
    background: 'none',
    border: '1px solid #374151',
    borderRadius: 6,
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'border-color 0.15s',
  },
};
