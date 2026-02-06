import { SendIcon } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  return (
    <form onSubmit={onSend} className="p-4 border-t border-base-300">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          className="input input-bordered flex-1 rounded-xl bg-base-300/40 border-base-300 placeholder:text-base-content/60"
        />
        <button
          type="submit"
          disabled={disabled}
          className="btn rounded-xl bg-linear-to-r from-amber-500 to-orange-500 border-none disabled:btn-disabled"
        >
          <SendIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}