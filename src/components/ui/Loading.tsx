import React from "react";
import "../../styles/loader.css";

type Props = {
  message?: string;
  size?: "sm" | "md" | "lg";
};

export default function Loading({ message, size }: Props) {
  return (
    <div>
      <span className="loader"></span>
      {message}
    </div>
  );
}
