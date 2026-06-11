import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', categoryId: '', basePrice: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get('/services'), api.get('/services/categories')])
      .then(([s, c]) => { setServices(s.data.data); setCategories(c.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/services', form);
    setShowForm(false);
    setForm({ name: '', slug: '', description: '', categoryId: '', basePrice: 0 });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={create} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="grid grid-2">
            <div className="form-group"><label>Name</label><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
            <div className="form-group"><label>Category</label><select className="form-control" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="">Select</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div className="form-group"><label>Base Price</label><input type="number" className="form-control" required value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} /></div>
            <div className="form-group"><label>Description</label><input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <button type="submit" className="btn btn-primary">Create Service</button>
        </form>
      )}
      <div className="table-wrapper card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.categoryId?.name}</td>
                <td>${s.basePrice}</td>
                <td>{s.isActive ? '✅' : '❌'}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => remove(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
