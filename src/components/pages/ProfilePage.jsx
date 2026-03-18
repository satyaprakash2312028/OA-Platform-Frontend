import React from 'react'
import useAuthStore from '../../store/useAuthStore'
import { User2, Mail } from 'lucide-react'

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-[70vh] p-6 max-w-4xl mx-auto">
      <div className="card app-card shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User2 size={28} className="text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{authUser.name || authUser.username || 'User'}</h2>
            <p className="text-sm opacity-70">{authUser.isVerified ? 'Verified user' : 'Unverified user'}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="label">Name</label>
            <input type="text" value={authUser.name || ''} readOnly className="input input-bordered w-full" />
          </div>

          <div className="input-group">
            <label className="label">Username</label>
            <input type="text" value={authUser.username || ''} readOnly className="input input-bordered w-full" />
          </div>

          <div className="input-group">
            <label className="label">Email</label>
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <input type="text" value={authUser.email || ''} readOnly className="input input-bordered w-full" />
            </div>
          </div>

          <div className="input-group">
            <label className="label">Member since</label>
            <input type="text" value={new Date(authUser.createdAt).toLocaleString()} readOnly className="input input-bordered w-full" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn btn-primary" disabled>Update Profile</button>
          <button className="btn btn-ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(authUser.email)}>Copy Email</button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
