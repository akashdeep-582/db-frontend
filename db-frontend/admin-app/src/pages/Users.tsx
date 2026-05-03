import { Button, ErrorMessage } from '@dropbroker/ui'
import { useAdminUsers, useUpdateUserStatus } from '../hooks/useAdminUsers'
import { getApiError } from '../utils/errors'
import type { AdminUser } from '../types/admin'

function UserRow({ user, onToggle, isPending }: {
  user: AdminUser
  onToggle: () => void
  isPending: boolean
}) {
  return (
    <div className="admin-row">
      <div className="admin-row-body">
        <div className="admin-row-title">{user.fullName}</div>
        <div className="admin-row-meta">{user.email} · {user.phone}</div>
      </div>
      <div className="admin-row-status" data-status={user.status}>
        {user.status}
      </div>
      <div className="admin-row-badge" data-role={user.role}>{user.role}</div>
      <div className="admin-row-actions">
        <Button
          size="sm"
          variant={user.status === 'active' ? 'danger' : 'outline'}
          onClick={onToggle}
          loading={isPending}
        >
          {user.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  )
}

export default function Users() {
  const { data: users, isLoading, error } = useAdminUsers()
  const { mutate, isPending, error: mutateError } = useUpdateUserStatus()

  if (isLoading) return <div className="ui-page">Loading…</div>

  return (
    <div className="ui-page" style={{ maxWidth: 860 }}>
      <h1 className="ui-page-heading">Users</h1>
      <p className="ui-page-subtitle">{users?.length ?? 0} users found</p>

      <ErrorMessage>{mutateError ? getApiError(mutateError) : ''}</ErrorMessage>

      {error && <ErrorMessage>{getApiError(error)}</ErrorMessage>}

      <div className="admin-list">
        {users?.map(u => (
          <UserRow
            key={u.id}
            user={u}
            isPending={isPending}
            onToggle={() => mutate({
              id: u.id,
              status: u.status === 'active' ? 'inactive' : 'active',
            })}
          />
        ))}
        {users?.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>No users found</p>
        )}
      </div>
    </div>
  )
}
