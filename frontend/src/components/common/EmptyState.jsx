export default function EmptyState({ icon = '📭', title = 'No data found', message = 'Check back later.' }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '3rem' }} aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
