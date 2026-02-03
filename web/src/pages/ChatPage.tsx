import { useAuth } from "@clerk/clerk-react"

function ChatPage() {
  const { signOut } = useAuth();

  return (
    <div>
      <button
        onClick={() => signOut()}
      >Sign Out</button>
    </div>
  )
}

export default ChatPage
