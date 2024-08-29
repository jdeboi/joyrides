"use client";

import { useState } from "react";

export default function MigrationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMigration = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Migration completed successfully.");
      } else {
        setMessage(`Migration failed: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Migration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Run Migration</h1>
      <button
        onClick={handleMigration}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Migration"}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
