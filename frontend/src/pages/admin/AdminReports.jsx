import api from '../../services/api';

const REPORTS = [
  { type: 'users', label: 'Users Report' },
  { type: 'providers', label: 'Providers Report' },
  { type: 'bookings', label: 'Bookings Report' },
  { type: 'revenue', label: 'Revenue Report' },
];

export default function AdminReports() {
  const download = async (type, format) => {
    const token = localStorage.getItem('accessToken');
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/reports?type=${type}&format=${format}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${type}-report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    a.click();
  };

  return (
    <div className="grid grid-2">
      {REPORTS.map((r) => (
        <div key={r.type} className="card">
          <h3>{r.label}</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1rem' }}>Generate and download report</p>
          <div className="action-btns">
            <button className="btn btn-primary btn-sm" onClick={() => download(r.type, 'pdf')}>📄 PDF</button>
            <button className="btn btn-outline btn-sm" onClick={() => download(r.type, 'excel')}>📊 Excel</button>
          </div>
        </div>
      ))}
    </div>
  );
}
