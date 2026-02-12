import React, { useState } from "react";
import api from "../../../shared/api/axios";
import { Heart, Send } from "lucide-react";
import { Button } from "../../../shared/ui/Button";

const CreditForm = ({ castId, onNoteSent }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Posts data to the notesController
      const res = await api.post("/notes", {
        cast_id: castId,
        content: content,
      });

      // The backend returns a confirmation message
      setMessage(res.data.message);
      setContent("");
      if (onNoteSent) onNoteSent();
    } catch (err) {
      console.error("Error sending gratitude note:", err);
      setMessage(err.response?.data?.error || "Failed to send credit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 p-4 bg-pink/15 border-3 border-ink shadow-brutal animate-in slide-in-from-top-2 duration-300">
      <h4 className="text-ink font-black flex items-center gap-2 mb-2 ">
        <Heart size={18} className="text-pink" /> SEND_CREDIT
      </h4>
      <p className="text-xs text-ink/70 mb-4 font-bold uppercase tracking-wide">
        Leaving a note awards the host +10 Credit!
      </p>

      {message ? (
        <div className="p-3 bg-white border-3 border-ink text-ink rounded-lg text-sm font-black">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            required
            className="input-brutal h-24 text-sm resize-none"
            placeholder="What did you learn from this session?"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="pink"
            className="w-full py-2 text-xs tracking-tight disabled:opacity-50"
          >
            <Send size={16} /> {isSubmitting ? "Sending..." : "Send Credit"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CreditForm;
