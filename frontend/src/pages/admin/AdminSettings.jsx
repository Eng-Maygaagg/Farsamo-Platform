import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/settings').then((r) => setSettings(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      setMessage('Settings saved!');
    } catch {
      setMessage('Failed to save');
    }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={save} className="card" style={{ maxWidth: '600px' }}>
      <h3>Platform Settings</h3>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="form-group"><label>Site Name</label><input className="form-control" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
      <div className="form-group"><label>Contact Email</label><input className="form-control" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></div>
      <div className="form-group"><label>Contact Phone</label><input className="form-control" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /></div>
      <div className="form-group"><label>Address</label><input className="form-control" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
      <div className="form-group"><label>Commission Rate (%)</label><input type="number" className="form-control" value={settings.commissionRate} onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })} /></div>
      <div className="form-group">
        <label><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} /> Maintenance Mode</label>
      </div>
      <button type="submit" className="btn btn-primary">Save Settings</button>
    </form>
  );
}
