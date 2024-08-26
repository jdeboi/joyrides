"use client";

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import L from "leaflet";
import dynamic from "next/dynamic";
import ThankYouModal from "./components/ThankYouModal"; // Import the modal
import Head from "next/head";

// Dynamically import the LocationPicker component
const LocationPicker = dynamic(() => import("./components/LocationPicker"), {
  ssr: false,
});

export default function Home() {
  const [location, setLocation] = useState<null | { lat: number; lng: number }>(
    null
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Force dark mode by adding the 'dark' class to the HTML element
    document.documentElement.classList.add("dark");
  }, []);

  const handleLocationSelect = (
    location: { lat: number; lng: number },
    description: string
  ) => {
    setError("");
    setLocation(location);
    setSearchDescription(description);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("Please enter a location by clicking or searching");
      return;
    }

    setError("");
    const formData = {
      name,
      phone,
      email,
      title,
      description,
      searchDescription,
      location,
    };
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Form data submitted successfully:", result);

      setIsModalOpen(true);

      setName("");
      setPhone("");
      setEmail("");
      setTitle("");
      setDescription("");
      setSearchDescription("");
      setLocation(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting form, please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top
  };

  // submit form to mongodb

  return (
    <>
      <Head>
        {/* Viewport meta tag for preventing zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-between p-10 md:p-14 lg:p-24">
        <div className="text-slate-400 mb-4">
          <h1 className="mb-4 text-4xl leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
            joyrides
          </h1>
          <p className="mb-4 italic text-sm">
            a monthly bike ride to incite joy!
          </p>
          <br></br>
          <p className="mb-3">
            <span className="text-slate-100">How it works:</span> You submit a
            geographic location that you find special and delightful. I curate a
            regular series of rides + bevies + bar stops + snacks to connect
            these places and our stories. Feel free to submit as many locations
            as you like!
          </p>
          <p className="mb-4">
            <span className="text-slate-100">For example:</span> You might share
            a hidden dock in a City Park lagoon, a cement plaque with a unique
            history, your favorite sourdough loaf, a native plant garden, the
            place you first fell in love with NOLA (or your special person) ...
            think Atlas Obscura meets NOLA social ride.
          </p>
        </div>
        <br></br>
        <div className="w-full mb-14">
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                name="name"
                value={name}
                onChange={(env) => setName(env.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name"
                required
              />
              {/* <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Name
            </label> */}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                value={email}
                onChange={(env) => setEmail(env.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="email"
                required
              />
              {/* <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label> */}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="tel"
                  name="floating_phone"
                  value={phone}
                  onChange={(env) => setPhone(env.target.value)}
                  id="floating_phone"
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="phone"
                  required
                />
                {/* <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Phone number (123-456-7890)
              </label> */}
              </div>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <textarea
                rows={4}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tell us about this special place..."
                value={description}
                onChange={(env) => setDescription(env.target.value)}
                required
              ></textarea>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <LocationPicker onLocationSelect={handleLocationSelect} />
              {/* {location && (
              <div className="text-xs text-slate-700">
                <p>
                  [{location.lat}, {location.lng}]
                </p>
                <p>{searchDescription}</p>
              </div>
            )} */}
            </div>

            {error != "" && <p className="text-red-500 mb-3">{error}</p>}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
        <ThankYouModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
    </>
  );
}
