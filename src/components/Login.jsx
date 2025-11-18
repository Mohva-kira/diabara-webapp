import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setCredentials } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import sing from "../assets/sing.gif";
import { useGetMeQuery } from "../redux/services/auth";
import Loader from "./Loader";
import {
  isValidPhoneNumber,
} from "libphonenumber-js";
import { MdPhone, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = ({ switchPage, switchModeHandler, login, isFetching, history }) => {
  const [phone, setPhone] = useState(
    localStorage.getItem("phone") ? localStorage.getItem("phone") : ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  const send = async () => {
    if (!isValidPhoneNumber(phone, "MLI", "CIV")) {
      toast.error("Entrez un numéro valide");
      return;
    }
    
    if (!password) {
      toast.error("Veuillez entrer votre mot de passe");
      return;
    }

    const data = { identifier: phone, password };

    try {
      await login(JSON.stringify(data))
        .unwrap()
        .then((response) => {
          console.log("connected", JSON.stringify(response));
          if (rememberMe) {
            localStorage.setItem("phone", phone);
          }
          localStorage.setItem("auth", JSON.stringify(response));
          dispatch(setCredentials(response));
          toast.success("Vous êtes connecté");
          checkProfile();
          navigate(from, { replace: true });
        });
    } catch (error) {
      console.error("err", error);
      toast.error("Numéro ou mot de passe incorrect");
    }
  };

  const user =
    localStorage.getItem("auth") && JSON.parse(localStorage.getItem("auth"));

  const {
    data: me,
    isSuccess: meSuccess,
    isFetching: meFetching,
    isError: meError,
  } = useGetMeQuery(user?.id);
  
  const checkProfile = () => {
    if (meFetching) return <Loader title={"Chargement profile"} />;
    console.log("me", me);
    if (me?.role.name === "Artist") {
      navigate(`/artist/${me?.id}`);
    }

    if (user) navigate("/");
  };

  const handlePhoneInput = (e) => {
    setPhone(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
          {/* Section gauche - Image (cachée sur mobile) */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={sing}
                alt="Music illustration"
                className="w-full max-w-md h-auto rounded-2xl shadow-2xl"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/adhesion")}
                className="absolute bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/50 transition-all duration-300 border border-blue-500/40"
              >
                Je suis un artiste
              </motion.button>
            </motion.div>
          </div>

          {/* Section droite - Formulaire */}
          <div className="w-full lg:w-1/2 xl:w-2/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-orange-500/20 corner"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Se connecter
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Bienvenue sur Diabara TV
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); send(); }}>
                {/* Input Téléphone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdPhone className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    placeholder="+22377888888"
                    maxLength="16"
                    minLength="8"
                    required
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  />
                  {phone && (
                    <label
                      htmlFor="phone"
                      className="absolute -top-3 left-4 px-2 bg-black/90 text-xs text-orange-400"
                    >
                      Numéro de téléphone
                    </label>
                  )}
                </div>

                {/* Input Mot de passe */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    placeholder="Mot de passe"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                  {password && (
                    <label
                      htmlFor="password"
                      className="absolute -top-3 left-4 px-2 bg-black/90 text-xs text-orange-400"
                    >
                      Mot de passe
                    </label>
                  )}
                </div>

                {/* Se souvenir et Mot de passe oublié */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-blue-500/50 bg-black/50 text-orange-500 focus:ring-orange-500/50 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-400 group-hover:text-white transition-colors">
                      Se souvenir
                    </span>
                  </label>
                  <Link
                    to="#"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>

                {/* Bouton Se connecter */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isFetching}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 border border-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetching ? "Connexion..." : "Se connecter"}
                </motion.button>

                {/* Lien vers Inscription */}
                <div className="text-center pt-4">
                  <p className="text-gray-400 text-sm">
                    Vous n'avez pas de compte?{" "}
                    <button
                      type="button"
                      onClick={() => switchPage()}
                      className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      S'inscrire
                    </button>
                  </p>
                </div>

                {/* Bouton Artiste sur mobile */}
                <div className="lg:hidden pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/adhesion")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 border border-orange-500/40"
                  >
                    Je suis un artiste
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
