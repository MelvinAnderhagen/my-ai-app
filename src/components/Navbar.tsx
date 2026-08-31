"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileIcon from "@iconify-react/iconamoon/profile";
import ProfileFillIcon from "@iconify-react/iconamoon/profile-fill";
import SettingsIcon from "@iconify-react/material-symbols/settings";
import SettingsOutlineIcon from "@iconify-react/material-symbols/settings-outline";
import LoginIcon from "@iconify-react/material-symbols/login";
import LoginOutlineIcon from "@iconify-react/material-symbols-light/login-outline";

import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  const pathname = usePathname();
  const settingsActive = pathname === "/settings";
  const profileActive = pathname === "/profile";
  const loginActive = pathname === "/login";

  return (
    <header className="fixed left-0 top-0 h-screen w-48 flex flex-col items-stretch border-r border-gray-200 bg-white px-3 py-4">
      <Link className="text-xl font-bold" href="/">
        <h1>MindDesk</h1>
      </Link>

      <div className="mt-4 flex w-full flex-col gap-3">
        <Link href="/chat" className="w-full">
          <div
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              pathname === "/chat"
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "bg-white text-slate-900 border-gray-200 hover:bg-slate-50"
            }`}
          >
            Assistant
          </div>
        </Link>
        <Link href="/faq" className="w-full">
          <div
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              pathname === "/faq"
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "bg-white text-slate-900 border-gray-200 hover:bg-slate-50"
            }`}
          >
            FAQ
          </div>
        </Link>
        <Link href="/contact" className="w-full">
          <div
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              pathname === "/contact"
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "bg-white text-slate-900 border-gray-200 hover:bg-slate-50"
            }`}
          >
            Contact
          </div>
        </Link>
      </div>

      <div className="mt-auto flex items-center justify-center gap-4">
        <Link href="/profile" className="mr-4 mt-2">
          {profileActive ? (
            <ProfileFillIcon height="28" />
          ) : (
            <ProfileIcon height="28" />
          )}
        </Link>
        <Link href="/settings" className="mr-4 mt-2">
          {settingsActive ? (
            <SettingsIcon height="28" />
          ) : (
            <SettingsOutlineIcon height="28" />
          )}
        </Link>
        <Link href="/login" className="mr-4 mt-2">
          {loginActive ? (
            <LoginIcon height="28" />
          ) : (
            <LoginOutlineIcon height="28" />
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
