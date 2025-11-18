import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";
import { motion } from "framer-motion";
import sing from "../assets/sing.gif";
import {
  isValidPhoneNumber,
} from "libphonenumber-js";
import { toast } from "react-toastify";
import { MdPhone, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle } from "react-icons/md";

const Register = ({
  switchPage,
  switchModeHandler,
  isFetchingRegister,
  register,
  isVisited,
  setIsVisited,
  addVisitor,
  visitorData,
  handleSkip
}) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const send = async () => {
    setIsVisited(!isVisited);
    
    if (!isValidPhoneNumber(phone, "MLI", "CIV")) {
      toast.error("Entrez un numéro valide");
      return;
    }

    if (password !== secondPassword) {
      setConfirmPassword(false);
      toast.error("Les mots de passe doivent être identiques");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setConfirmPassword(true);

    try {
      const data = { username: phone, password, email: phone + "@diabara.tv" };
      console.log("data", data);
      await register(JSON.stringify(data))
        .then((rep) => {
          console.log("reponse", rep);
          localStorage.setItem("auth", JSON.stringify(rep));
          localStorage.setItem("phone", phone);
          dispatch(setCredentials(rep?.data));
          toast.success("Compte créé avec succès");
          handleSkip();
          switchPage();
        })
        .catch((err) => {
          console.log("error", err);
          toast.error("Une erreur est survenue, veuillez réessayer");
        });
    } catch (error) {
      console.log("error", error);
      toast.error("Une erreur est survenue");
    }
  };

  const passwordMatch = password && secondPassword && password === secondPassword;
  const passwordLength = password.length >= 6;

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
            >
              <img
                src={sing}
                alt="Music illustration"
                className="w-full max-w-md h-auto rounded-2xl shadow-2xl"
              />
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
                  Inscription
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Créez votre compte Diabara TV
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
                    onChange={(e) => setPhone(e.target.value)}
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
                  {password && (
                    <div className="mt-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordLength ? 'text-green-400' : 'text-gray-400'}`}>
                        <MdCheckCircle size={14} />
                        <span>Au moins 6 caractères</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Confirmation mot de passe */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={secondPassword}
                    placeholder="Confirmer le mot de passe"
                    required
                    onChange={(e) => setSecondPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      secondPassword
                        ? passwordMatch
                          ? "border-green-500/50 focus:ring-green-500/50"
                          : "border-red-500/50 focus:ring-red-500/50"
                        : "border-blue-500/30 focus:ring-orange-500/50 focus:border-orange-500/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                  {secondPassword && (
                    <label
                      htmlFor="confirmPassword"
                      className="absolute -top-3 left-4 px-2 bg-black/90 text-xs text-orange-400"
                    >
                      Confirmer le mot de passe
                    </label>
                  )}
                  {secondPassword && (
                    <div className="mt-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}>
                        <MdCheckCircle size={14} />
                        <span>{passwordMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton S'inscrire */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isFetchingRegister || !passwordMatch || !passwordLength}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 border border-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingRegister ? "Inscription..." : "S'inscrire"}
                </motion.button>

                {/* Lien vers Connexion */}
                <div className="text-center pt-4">
                  <p className="text-gray-400 text-sm">
                    Vous avez déjà un compte?{" "}
                    <button
                      type="button"
                      onClick={() => switchPage()}
                      className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
