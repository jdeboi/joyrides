"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""; // Ensure you set this in your environment variables

interface Submission {
  id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
  createdAt?: string;
  email?: string;
  phone?: string;
  searchDescription?: string;
  title?: string;
  _id?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await fetch("/api/submissions"); // This API should return all the submissions
      if (!response.ok) {
        // throw new Error("Failed to fetch submissions");
        console.log("response not ok");
        return;
      }
      const data = await response.json();
      console.log(data);
      if (data && data.submissions && Array.isArray(data.submissions)) {
        const formattedSubmissions: Submission[] = data.submissions.map(
          (submission: any) => {
            // Perform explicit type casting to ensure each object is treated as a Submission
            return {
              id: submission._id, // Assign _id to id for consistency
              name: submission.name,
              description: submission.description,
              location: submission.location,
              createdAt: submission.createdAt,
              email: submission.email,
              phone: submission.phone,
              searchDescription: submission.searchDescription,
              title: submission.title,
              _id: submission._id,
            } as Submission; // Type assertion
          }
        );
        setSubmissions(formattedSubmissions);
        setLoading(false);
      } else {
        const errorMessage = "Unexpected data format received from API";
        console.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        const response = await fetch(`/api/submissions/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setSubmissions(
            submissions.filter((submission) => submission.id !== id)
          );
          setSelectedSubmission(null);
        } else {
          alert("Failed to delete submission.");
        }
      } catch (error) {
        console.error("Error deleting submission:", error);
        alert("Error deleting submission. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there is one
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full h-full">
        <Map
          initialViewState={{
            latitude: 29.97,
            longitude: -90.1,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
        >
          {Array.isArray(submissions) &&
            submissions.map((submission) => (
              <Marker
                key={submission.id} // Ensure a unique key for each Marker
                latitude={submission.location.lat}
                longitude={submission.location.lng}
              >
                <div
                  className="cursor-pointer text-red-600 text-xl flex flex-col items-center"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  📍
                  <span className="text-sm text-black bg-white rounded px-1">
                    {submission.name}
                  </span>
                </div>
              </Marker>
            ))}

          {selectedSubmission && (
            <Popup
              latitude={selectedSubmission.location.lat}
              longitude={selectedSubmission.location.lng}
              onClose={() => setSelectedSubmission(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div className="text-black">
                <h2 className="font-bold">{selectedSubmission.name}</h2>
                <p>{selectedSubmission.description}</p>
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="mt-2 text-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
