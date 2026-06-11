export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <p>{text}</p>
    </div>
  );
}
