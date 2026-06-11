const STATUS_ORDER = ['submitted', 'pending', 'accepted', 'in_progress', 'completed'];
const STATUS_LABELS = {
  submitted: 'Submitted',
  pending: 'Pending Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function BookingTimeline({ status, statusHistory = [] }) {
  const isRejected = status === 'rejected' || status === 'cancelled';
  const steps = isRejected
    ? ['submitted', 'pending', status]
    : STATUS_ORDER;

  const currentIndex = steps.indexOf(status);

  return (
    <div className="booking-timeline" role="list" aria-label="Booking status timeline">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex || (index === currentIndex && status === 'completed');
        const isCurrent = index === currentIndex;
        const isRejectedStep = step === 'rejected' || step === 'cancelled';
        const historyEntry = statusHistory.find((h) => h.status === step);

        return (
          <div
            key={step}
            className={`timeline-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isRejectedStep ? 'rejected' : ''}`}
            role="listitem"
          >
            <div className="timeline-dot" aria-hidden="true">
              {isComplete ? '✓' : isRejectedStep ? '✕' : index + 1}
            </div>
            <div className="timeline-content">
              <strong>{STATUS_LABELS[step]}</strong>
              {historyEntry && (
                <small>{new Date(historyEntry.changedAt).toLocaleString()}</small>
              )}
            </div>
            {index < steps.length - 1 && <div className="timeline-line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}
