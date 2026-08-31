"use client";
import React from "react";

function Register() {
  return (
    <div>
      <form className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
