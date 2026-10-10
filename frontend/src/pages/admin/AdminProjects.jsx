import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../lib/api';

export default function AdminProjects() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => adminApi.getProjects(),
    refetchInterval: 4000,
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => {
      toast.success('Project deleted successfully');
      queryClient.invalidateQueries(['admin-projects']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? This will delete all associated plots.')) {
      deleteMutation.mutate(id);
    }
  };

  const projects = data?.projects || [];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-sub">Manage all industrial land projects</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-primary">
          <Plus size={18} /> Add Project
        </Link>
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: 24, textAlign: 'center' }}><span className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            No projects found. Create one to get started.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Plots Available</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const available = project.plotCounts?.AVAILABLE || 0;
                  const total = Object.values(project.plotCounts || {}).reduce((a, b) => a + b, 0);

                  return (
                    <tr key={project.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{project.name}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{project.slug}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={14} color="#94a3b8" />
                          <span>{project.location}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${project.isActive ? 'badge-available' : 'badge-hold'}`}>
                          {project.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {total > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 600, color: available > 0 ? '#059669' : '#dc2626' }}>
                              {available}
                            </span>
                            <span style={{ color: '#64748b', fontSize: 13 }}>/ {total}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 13 }}>No plots</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <Link to={`/admin/projects/${project.id}/edit`} className="btn btn-icon btn-outline btn-sm">
                            <Edit2 size={14} />
                          </Link>
                          <button
                            className="btn btn-icon btn-outline btn-sm"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                            onClick={() => handleDelete(project.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
