import React, { useContext, useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const menuLinks = [
    { name: "Home", link: "#home" },
    { name: "Account", link: "#account" },
    { name: "Settings", link: "#settings" },
    currentUser && {
      name: (
        <div className="flex items-center justify-center gap-3">
          {currentUser.email} <LogoutButton />
        </div>
      ),
    },
  ];

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      window.scrollY > 0 ? setSticky(true) : setSticky(false);
    });
  }, []);

  return (
    <nav className={`fixed w-full left-0 top-0 z-[999]  bg-cyan-500 `}>
      <div className="flex items-center justify-between ">
        <div className="flex items-center justify-between">
          <div className="mx-7">
            <h4 className="text-3xl  font-bold text-white lg:text-4xl">
              CRUD App
            </h4>
          </div>
        </div>
        <div
          className={` ${sticky ? ` bg-gray-300` : `bg-gray-300`} 
            text-gray-900 md:block hidden px-7 py-2 font-medium rounded-bl-full`}
        >
          <ul className="flex items-center gap-1 py-2 text-lg">
            {menuLinks?.map((menu, i) => {
              return (
                <li key={i} className=" px-6 hover:text-cyan-600">
                  <a href={menu?.link}>{menu?.name}</a>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className={`z-[999] cursor-pointer ${
            open ? "text-gray-900" : " text-gray-900"
          } text-3xl md:hidden m-5`}
        >
          <ion-icon name="menu"></ion-icon>
        </div>
        <div
          className={`md:hidden text-gray-900 absolute w-1.5/3 h-screen px-7 font-bold bg-cyan-400/90 top-0 right-0 duration-500 ${
            open ? "right-0" : "right-[-100%]"
          }`}
        >
          <ul className="flex flex-col justify-center mt-10 gap-10 py-2 text-sm">
            {menuLinks?.map((menu, i) => {
              return (
                <li
                  onClick={() => setOpen(false)}
                  key={i}
                  className=" px-6 hover:text-cyan-600"
                >
                  <a href={menu?.link}>{menu?.name}</a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
