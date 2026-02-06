import { useState } from "react";
import { UsersIcon, SearchIcon } from "lucide-react";
import { useSocketStore } from "../lib/socket";
import { useUsers } from "../hooks/useUsers";

interface User {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface NewChatModalProps {
  onStartChat: (participantId: string) => void;
  isPending?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function NewChatModal({
  onStartChat,
  isPending,
  isOpen,
  onClose,
}: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { onlineUsers } = useSocketStore();
  const { data, isLoading, isError, error } = useUsers();
  const allUsers = data?.users || [];
  const isOnline = (id: string) => onlineUsers.has(id);

  const handleStartChat = (participantId: string) => {
    onStartChat(participantId);
    setSearchQuery("");
    onClose();
  };

  const searchResults = allUsers.filter((u: User) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
  });

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <UsersIcon className="size-5 text-primary" />
          New Chat
        </h3>
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/60 z-10 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="input input-bordered w-full pl-10"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-sm text-amber-400" />
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-error text-sm">
              <p>Error loading users</p>
              {error instanceof Error && <p className="text-xs mt-2">{error.message}</p>}
            </div>
          )}

          {!isLoading && !isError && searchResults.length === 0 ? (
            <div className="py-8 text-center text-base-content/60 text-sm">
              {searchQuery ? "No users found" : `No users available (loaded ${allUsers.length} users)`}
            </div>
          ) : !isLoading && !isError && searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((u: User) => (
                <button
                  key={u._id}
                  onClick={() => handleStartChat(u._id)}
                  disabled={isPending}
                  className="btn btn-ghost justify-start gap-3 w-full normal-case"
                >
                  <div className="relative">
                    <img src={u.avatar} alt={u.name ?? "avatar"} className="w-10 h-10 rounded-full" />
                    {isOnline(u._id) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-200" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-base-content/70">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn"
              onClick={() => {
                setSearchQuery("");
                onClose();
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}