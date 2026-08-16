"use client";

import { useState } from "react";
import { Plus, Pencil, UserX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, Select, ErrorText } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useApiGet } from "@/lib/client/useApi";
import { api, ApiError } from "@/lib/client/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Paginated, User } from "@/lib/types";

export default function SuperAdminUsersPage() {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useApiGet<Paginated<User>>("superadmin/users", {
    role: role || undefined,
    search: search || undefined,
    page,
  });
  const { push } = useToast();
  const { user: currentUser } = useAuth();
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  async function deactivate(user: User) {
    if (!confirm(`Deactivate ${user.name}?`)) return;
    try {
      await api.del(`superadmin/users/${user.id}`);
      push("User deactivated.", "success");
      refetch();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to deactivate user.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <Reveal className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Users</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" /> New User
        </Button>
      </Reveal>

      <div className="flex flex-wrap gap-3">
        <Select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="w-48">
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </Select>
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-64" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <FullPageSpinner />
        ) : !data || data.data.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No users found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <Stagger as="tbody" className="divide-y divide-gray-100" stagger={0.03}>
                  {data.data.map((user) => (
                    <StaggerItem key={user.id} as="tr" y={8} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{user.role}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3">
                        <Badge tone={user.is_active ? "success" : "neutral"}>{user.is_active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditing(user)} className="text-navy-500 hover:text-navy-800">
                            <Pencil className="size-4" />
                          </button>
                          {user.id !== currentUser?.id && user.is_active && (
                            <button onClick={() => deactivate(user)} className="text-red-400 hover:text-red-600">
                              <UserX className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </StaggerItem>
                  ))}
                </Stagger>
              </table>
            </div>
            <Pagination page={data.current_page} lastPage={data.last_page} onChange={setPage} />
          </>
        )}
      </div>

      <CreateUserModal open={creating} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); refetch(); }} />
      <EditUserModal user={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refetch(); }} />
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { push } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await api.post("superadmin/users", form);
      push("User created.", "success");
      setForm({ name: "", email: "", password: "", role: "customer" });
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? {});
        push(err.message, "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="new_name" required>Name</Label>
          <Input id="new_name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} />
          <ErrorText>{errors.name?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="new_email" required>Email</Label>
          <Input id="new_email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email?.[0]} />
          <ErrorText>{errors.email?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="new_password" required>Password</Label>
          <Input id="new_password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} error={errors.password?.[0]} />
          <ErrorText>{errors.password?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="new_role" required>Role</Label>
          <Select id="new_role" required value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </Select>
        </div>
        <Button type="submit" className="w-full" loading={saving}>
          Create User
        </Button>
      </form>
    </Modal>
  );
}

function EditUserModal({ user, onClose, onSaved }: { user: User | null; onClose: () => void; onSaved: () => void }) {
  const { push } = useToast();
  const [form, setForm] = useState({ name: "", role: "customer", is_active: true });
  const [key, setKey] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  if (user && user.id !== key) {
    setKey(user.id);
    setForm({ name: user.name, role: user.role, is_active: user.is_active });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await api.put(`superadmin/users/${user.id}`, form);
      push("User updated.", "success");
      onSaved();
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Failed to update user.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={Boolean(user)} onClose={onClose} title={`Edit ${user?.name ?? ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit_name">Name</Label>
          <Input id="edit_name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="edit_role">Role</Label>
          <Select id="edit_role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded" />
          Active
        </label>
        <Button type="submit" className="w-full" loading={saving}>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
