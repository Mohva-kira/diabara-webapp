import React, { useState } from "react";
import { useAddArtistMutation } from "../redux/services/artistApi";
import { motion } from "framer-motion";
import { useRegisterMutation } from "../redux/services/auth";
import { useNavigate } from "react-router-dom";
import { 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdLock, 
  MdLocationOn, 
  MdMusicNote,
  MdCalendarToday,
  MdArtTrack
} from "react-icons/md";
import { toast } from "react-toastify";
const Adhesion = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState();  
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [date_naissance, setDate_naissance] = useState();
  const [adresse, setAdresse] = useState();
  const [genre, setGenre] = useState();
  const [phone, setPhone] = useState();
  const [addArtist] = useAddArtistMutation();
  const [register, { isFetchingRegister }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !phone || !password || !password2) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (password !== password2) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      let data = { username: phone, email, password };
      const user = await register(JSON.stringify(data));
      
      if (user.data) {
        const artistData = {
          name,
          email,
          adresse,
          genre,
          date_naissance,
          phone
        };
        
        const response = await addArtist(JSON.stringify({ data: artistData }));
        
        if (response.data) {
          toast.success("Inscription réussie ! Bienvenue sur Diabara TV 🎵");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Animation musicale
  const MusicAnimation = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Cercles animés */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-orange-500/30"
            style={{
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Icône musicale centrale */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-8 shadow-2xl"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <MdMusicNote className="text-6xl text-white" />
      </motion.div>
      
      {/* Notes de musique flottantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-orange-400 text-2xl"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          ♪
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Section gauche - Animation musicale */}
          <motion.div 
            className="w-full lg:w-1/2 h-96 lg:h-[600px]"
            variants={itemVariants}
          >
            <MusicAnimation />
          </motion.div>

          {/* Section droite - Formulaire */}
          <motion.div 
            className="w-full lg:w-1/2 max-w-md"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-500/20">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4"
                >
                  <MdArtTrack className="text-3xl text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Inscription Artiste
                </h1>
                <p className="text-gray-400">
                  Rejoignez la communauté Diabara TV 🎵
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Nom d'artiste */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdPerson className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Nom d'artiste"
                    required
                  />
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Email"
                    required
                  />
                </motion.div>

                {/* Téléphone */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdPhone className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Téléphone"
                    required
                  />
                </motion.div>

                {/* Date de naissance */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdCalendarToday className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="date"
                    value={date_naissance}
                    onChange={(e) => setDate_naissance(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </motion.div>

                {/* Mot de passe */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Mot de passe"
                    required
                  />
                </motion.div>

                {/* Confirmation mot de passe */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </motion.div>

                {/* Adresse */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLocationOn className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="text"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Adresse"
                  />
                </motion.div>

                {/* Genre musical */}
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <MdMusicNote className="text-gray-400 text-xl" />
                  </div>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 appearance-none"
                  >
                    <option value="">Sélectionner un genre</option>
                    <option value="mandingue">Mandingue</option>
                    <option value="griot">Griot</option>
                    <option value="rap">Rap</option>
                    <option value="rnb">RnB</option>
                    <option value="reggae">Reggae</option>
                    <option value="afrobeat">Afrobeat</option>
                  </select>
                </motion.div>
                {/* Boutons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  variants={itemVariants}
                >
                  <motion.button
                    type="submit"
                    disabled={isFetchingRegister}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingRegister ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Inscription...
                      </div>
                    ) : (
                      "S'inscrire"
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => navigate("/login")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-transparent border border-orange-500 text-orange-500 font-semibold py-3 px-6 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    Se connecter
                  </motion.button>
                </motion.div>
              </form>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  En vous inscrivant, vous acceptez nos{" "}
                  <a href="/terms-of-service" className="text-orange-500 hover:underline">
                    conditions d'utilisation
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Adhesion;
