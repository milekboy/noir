"use client";
import Link from "next/link";
import IMAGES from "../../constant/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
type MenuItem = {
  title: string;
  url: string;
};

const accountMenu: MenuItem[] = [
  //   { title: "Dashboard", url: "/account-dashboard" },
  { title: "Profile", url: "/account-profile" },
  { title: "Orders", url: "/account-orders" },
  //   { title: "Downloads", url: "/account-downloads" },
  //   { title: "Return request", url: "/account-return-request" },
];

export default function CommanSidebar() {
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <aside className="col-xl-3">
      <div className="toggle-info">
        <h5 className="title mb-0">Account Navbar</h5>
        <a className="toggle-btn" href="#accountSidebar">
          Account Menu
        </a>
      </div>
      <div className="sticky-top account-sidebar-wrapper">
        <div className="account-sidebar" id="accountSidebar">
          <div className="profile-head">
            <div
              className="user-thumb d-flex justify-content-center align-items-center bg-light border"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            >
              <i
                className="fa-solid fa-user text-secondary"
                style={{ fontSize: "48px" }}
              />
            </div>

            <h5 className="title mb-0">
              {user?.firstName} {""} {user?.lastName}
            </h5>
            <span className="text text-primary">{user?.email}</span>
          </div>
          <div className="account-nav">
            <div className="nav-title bg-light">DASHBOARD</div>
            <ul>
              {accountMenu.map((elem, index) => (
                <li key={index}>
                  <Link href={elem.url}>{elem.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
