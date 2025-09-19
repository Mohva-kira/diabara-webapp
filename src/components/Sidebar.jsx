import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

import { HiOutlineMenu } from "react-icons/hi";
import { links } from "../assets/constants";
import logo from "../assets/logo.png";

const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex flex-row justify-start items-center
         my-8 text-sm font-medium text-gray-400 hover:text-orange-500"
        onClick={() => handleClick && handleClick()}>
        <item.icon className="w-6 h-6 mr-2 text-orange-500" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 justify-between bg-[#191624]">
        <div>
          <img src={logo} alt="logo" className="w-full h-auto object-contain" />
          <NavLinks />
        </div>
        <div className="flex flex-col space-y-2">
          <a href="/terms-of-service" className="text-white text-xs font-bold">
            Condition Générales d'utilisation
          </a>
          <a
            href="/politique-confidentialite"
            className="text-white text-xs font-bold">
            Politique de Confidentialité
          </a>
        </div>
      </div>

      <div className="absolute md:hidden block top-8 right-3">
        {mobileMenuOpen ? (
          <RiCloseLine
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : (
          <HiOutlineMenu
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483d8b] flex flex-col justify-between
                    background-blur-lg z-10 p-6 md:hidden smooth-transition ${mobileMenuOpen ? "bloc" : "hidden"}`}>
        <div>
          <img src={logo} alt="logo" className="w-full h-14 object-contain" />
          <NavLinks handleClick={() => setMobileMenuOpen(false)} />
        </div>

        <div className="flex flex-col space-y-2">
          <a href="/terms-of-service" className="text-white text-xs font-bold">
            Condition Générales d'utilisation
          </a>
          <a
            href="/politique-confidentialite"
            className="text-white text-xs font-bold">
            Politique de Confidentialité
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
