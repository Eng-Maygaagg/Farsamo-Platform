import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = {};
    if (role) params.role = role;
    if (search) params.search = search;
    api.get('/admin/users', { params }).then((r) => setUsers(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [role, search]);

  const toggleActive = async (id, isActive) => {
    await api.put(`/admin/users/${id}`, { isActive: !isActive });
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input className="form-control" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {loading ? <Loading /> : (
        <div className="table-wrapper card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td><span className="badge">{u.role}</span></td>
                  <td>{u.isActive ? '✅ Active' : '❌ Inactive'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    {u.role !== 'admin' && (
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
