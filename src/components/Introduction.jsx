import { motion } from "framer-motion";
import React, { useState } from "react";
import intro from "../assets/intro.jpg";
import { useGetArtistsByGenreQuery } from "../redux/services/artistApi";
import { useRegisterMutation } from "../redux/services/auth";
import { usePostFavoritesMutation } from "../redux/services/favorites";
import { useGetGenresQuery } from "../redux/services/genres";
import Loader from "./Loader";
import Register from "./Register";

const Introduction = ({
  isVisited,
  setIsVisited,
  firstVisitData,
  addVisitor,
}) => {
  const words = "Bienvenue !!!".split(" ");
  const prefTitle = "Vos préferences".split(" ");
  const { data, isLoading, isFetching, isSuccess } = useGetGenresQuery();
  const {
    data: artistData,
    isLoading: artistIsLoading,
    isFetching: artistIsFetching,
    isSuccess: artistIsSuccess,
  } = useGetArtistsByGenreQuery();

  const API_FILE_URL = import.meta.env.VITE_API_FILE_URL;

  const [isAccepted, setIsAccepted] = useState(false);

  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const randomString =
    Math.random().toString(20).substring(2, 14) +
    Math.random().toString(20).substring(2, 14);

  const [selected, setSelected] = useState(0);
  const [prefs, setPrefs] = useState([]);
  const [prefsArtists, setPrefsArtists] = useState([]);

  const [registerAccount, { isFetchingRegister }] = useRegisterMutation();
  const [postFavorite, { isFetchingFavoritesPost }] =
    usePostFavoritesMutation();

  // Variants for Container of words.
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.04 * i,
        duration: 0.1,
      },
    }),
  };

  // Variants for each word.

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const handleSelectPrefs = (item) => {
    setPrefs((prevPref) => {
      if (prevPref.includes(item)) {
        // Retire l'élément s'il est déjà présent
        return prevPref.filter((pref) => pref !== item);
      } else {
        // Ajoute l'élément s'il n'est pas présent
        return [...prevPref, item];
      }
    });
  };

  const handleSelectArtists = (item) => {
    setPrefsArtists((prefsArtists) => {
      if (prefsArtists.includes(item)) {
        // Retire l'élément s'il est déjà présent
        return prefsArtists.filter((pref) => pref !== item);
      } else {
        // Ajoute l'élément s'il n'est pas présent
        return [...prefsArtists, item];
      }
    });
  };

  const handleNext = () => {
    setSelected((prevSelected) => (prevSelected + 1) % contents.length);
  };

  // Gérer le bouton "Passer" (exemple : fermer la modale ou passer au contenu suivant)
  const handleSkip = () => {
    // Si tu veux faire une action spécifique ici (par exemple fermer la modale)
    addVisitor(firstVisitData).then((res) => {});

    let favData = {
      data: {
        uuid: localStorage.getItem("uuid"),
        genres: prefs,
        artists: prefsArtists,
      },
    };

    postFavorite(favData).then((res) => {
      console.log("fav enregistrer", res);
    });

    setIsVisited(!isVisited);
  };

  // Les slides de l'introduction
  const preferences = (
    <div className="w-full h-full ">
      <div className="w-full flex justify-center items-center p-2">
        <motion.div
          style={{
            overflow: "hidden",
            display: "flex",
            fontSize: "2rem",
          }}
          variants={container}
          initial="hidden"
          animate="visible">
          {prefTitle.map((word, index) => (
            <motion.span
              variants={child}
              style={{ marginRight: "5px" }}
              key={index}>
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="w-full h-36 mt-10">
        <div className="w-full  flex flex-col flex-wrap gap-10 h-[35vh] mt-10 ">
          <div className="w-full space-x-4 flex items-center    animate-loop-scroll ">
            {isFetching ? (
              <Loader title="Chargement des genres...." />
            ) : (
              data?.data.slice(0, 9).map((item) => (
                <div
                  onClick={() => handleSelectPrefs(item)}
                  style={{ backgroundColor: item.attributes.color }}
                  className={`px-4  h-full ${
                    prefs.find(
                      (pref) => pref.attributes.name === item.attributes.name
                    )
                      ? "text-slate-500 shadow-orange-500 shadow-xl"
                      : "text-black shadow-md"
                  } cursor-pointer w-60  align-baseline      font-bold    rounded-2xl  `}>
                  {" "}
                  {item.attributes.name}{" "}
                </div>
              ))
            )}
          </div>
          <div className="w-full flex justify-around animate-loop-scroll-invert space-x-5">
            {isFetching ? (
              <Loader title="Chargement des genres...." />
            ) : (
              data?.data.slice(9, 19).map((item, index) => (
                <div
                  onClick={() => handleSelectPrefs(item)}
                  key={index}
                  style={{ backgroundColor: item.attributes.color }}
                  className={`p-2  ${
                    prefs.find(
                      (pref) => pref.attributes.name === item.attributes.name
                    )
                      ? "text-white shadow-orange-500 shadow-xl"
                      : "text-black shadow-md"
                  } cursor-pointer flex flex-grow items-stretch p-4 align-baseline   w-36  font-bold    rounded-2xl h-fit `}>
                  {" "}
                  {item.attributes.name}{" "}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-10 h-[35vh] p-2">
        <div className="flex justify-between animate-loop-scroll">
          {artistIsFetching ? (
            <Loader title="Chargement des genres...." />
          ) : (
            artistData?.data.slice(0, 9).map((item) => (
              <div
                onClick={() => handleSelectArtists(item)}
                className={`${
                  prefsArtists.find(
                    (prefsArtists) =>
                      prefsArtists.attributes.name === item.attributes.name
                  )
                    ? "text-sky-900 shadow-orange-500 shadow-xl"
                    : "text-black shadow-md"
                } "flex flex-col relative z-0  items-center m-4 w-32 h-32 font-bold  rounded-2xl p-3 space-x-5"`}>
                <div
                  style={{
                    backgroundImage: `url(${
                      API_FILE_URL +
                      item.attributes.image.data[0].attributes?.url
                    })`,
                    filter: "blur(50px)",
                  }}
                  className="w-full h-full bg-cover scale-100 -z-50  absolute"></div>
                <img
                  className="w-16 h-16 z-50 object-cover rounded-full mr-4"
                  src={
                    API_FILE_URL + item.attributes.image.data[0].attributes?.url
                  }
                  alt=""
                />
                <p className="flex-grow truncate">{item.attributes.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const register = (
    <div className="w-full h-fit flex flex-col justify-center items-center p-2">
      <div className="w-full">
        <motion.div
          style={{
            overflow: "hidden",
            display: "flex",
            fontSize: "2rem",
          }}
          variants={container}
          initial="hidden"
          animate="visible">
          {words.map((word, index) => (
            <motion.span
              variants={child}
              style={{ marginRight: "5px" }}
              key={index}>
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
      =
      <div className="w-full  h-full">
        {
          <Register
            register={registerAccount}
            isVisited={isVisited}
            setIsVisited={setIsVisited}
            addVisitor={addVisitor}
            handleSkip={handleSkip}
          />
        }
      </div>
    </div>
  );

  const welcomeSlide = (
    <div className="w-full h-full">
      <div className="w-full z-50 flex justify-center items-center p-2">
        <motion.div
          style={{
            overflow: "hidden",
            display: "flex",
            fontSize: "2rem",
          }}
          variants={container}
          initial="hidden"
          animate="visible">
          {words.map((word, index) => (
            <motion.span
              variants={child}
              style={{ marginRight: "5px", zIndex: 100 }}
              key={index}>
              <h2 className="text-2xl font-bold text-orange-600">{word}</h2>
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="w-full h-full z-50">
        <div className="w-full h-full">
          <img className="w-full h-full object-contain ezà" src={intro} />
        </div>
      </div>
    </div>
  );

  const CGU = (
    <div>
      <div className="w-full p-6 h-52 border border-slate-400 shadow-md rounded-lg overflow-hidden overflow-scroll bg-white text-gray-900 ">
        <h1 className="font-bold text-2xl text-black">
          CONDITIONS GÉNÉRALES D'UTILISATION DE DIABARA.TV
        </h1>
        <p className="font-thin text-sm">Dernière mise à jour : 15/02/2025</p>

        <h2 className="font-semibold text-lg mt-4">1. PRÉAMBULE</h2>
        <p>
          Diabara.tv est une plateforme de streaming proposant des contenus
          audiovisuels africains et internationaux, incluant une future Web TV.
          Elle est exploitée par
          <a
            href="https://flyentreprise.com"
            target="_blank"
            className="text-blue-500 underline">
            FLY
          </a>
          , immatriculée au Registre du Commerce sous le numéro
          <b>MA.BKO.2014.A.2530</b> et domiciliée à Faladie Sema, Bamako, MALI.
          L'accès et l'utilisation de Diabara.tv impliquent l'acceptation pleine
          et entière des présentes Conditions Générales d'Utilisation (CGU).
        </p>

        <h2 className="font-semibold text-lg mt-4">
          2. ACCEPTATION ET MODIFICATION DES CGU
        </h2>
        <p>
          2.1. En accédant à Diabara.tv, l'utilisateur reconnaît avoir pris
          connaissance et accepté sans réserve les présentes CGU.
        </p>
        <p>
          2.2. Diabara.tv se réserve le droit de modifier les CGU à tout moment.
          Les modifications entreront en vigueur à compter de leur publication
          sur le site et l’application.
        </p>

        <h2 className="font-semibold text-lg mt-4">3. ACCÈS AUX SERVICES</h2>
        <p>
          3.1. L'accès à Diabara.tv est ouvert à toute personne disposant d'une
          connexion Internet. Certains contenus peuvent nécessiter un abonnement
          payant.
        </p>
        <p>
          3.2. L’utilisateur s’engage à ne pas contourner, désactiver ou
          perturber les fonctionnalités de sécurité du site.
        </p>

        <h2 className="font-semibold text-lg mt-4">4. COMPTES UTILISATEURS</h2>
        <p>
          4.1. La création d’un compte est nécessaire pour accéder à certains
          services.
        </p>
        <p>
          4.2. L’utilisateur est responsable de la confidentialité de ses
          identifiants.
        </p>
        <p>
          4.3. En cas d’utilisation frauduleuse du compte, Diabara.tv se réserve
          le droit de suspendre ou supprimer le compte concerné.
        </p>

        <h2 className="font-semibold text-lg mt-4">
          5. CRYPTAGE ET SÉCURITÉ DES DONNÉES
        </h2>
        <p>
          5.1. Les informations sensibles des utilisateurs sont chiffrées à
          l’aide de protocoles de sécurité conformes aux normes internationales.
        </p>
        <p>
          5.2. Diabara.tv met en œuvre des mesures techniques et
          organisationnelles pour protéger les données personnelles contre tout
          accès non autorisé.
        </p>

        <h2 className="font-semibold text-lg mt-4">
          6. POLITIQUE RELATIVE AUX SERVICES YOUTUBE
        </h2>
        <p>
          6.1. Diabara.tv utilise les services YouTube API pour afficher des
          vidéos.
        </p>
        <p>
          6.2. En utilisant Diabara.tv, l’utilisateur accepte d'être lié par les
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            className="text-blue-500 underline">
            Conditions d'utilisation de YouTube
          </a>
          .
        </p>
        <p>
          6.3. La politique de confidentialité de Google est accessible ici :
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            className="text-blue-500 underline">
            Google Privacy Policy
          </a>
          .
        </p>

        <h2 className="font-semibold text-lg mt-4">7. CONTACT</h2>
        <p>
          Pour toute question relative aux présentes CGU, veuillez contacter :
          <a
            href="mailto:support@diabara.tv"
            className="text-blue-500 underline">
            support@diabara.tv
          </a>
          .
        </p>
      </div>
      <div className="p-2 space-x-2 flex justify-center items-center">
        <label htmlFor="accept">
          Accepter les Conditions Générales d'utilisation{" "}
          <span className="text-red-500 text-xl"> * </span>{" "}
        </label>
        <input
          onClick={() => setIsAccepted(true)}
          type="checkbox"
          className={`shadow-sm ${!isAccepted ? " shadow-red-500" : "shadow-green-500"} "w-7 h-7 "`}
          id="accept"
        />
      </div>
    </div>
  );
  const contents = [welcomeSlide, preferences, CGU, register];

  console.log("prefs", prefs, prefsArtists);
  return (
    <div
      className="relative z-10 h-screen"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen flex items-center justify-center p-4">
        <div className="relative w-full sm:max-w-lg bg-blue-900 rounded-2xl shadow-xl">
          <div
            className="bg-white w-full flex flex-col p-6 rounded-t-2xl overflow-y-auto max-h-[80vh]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#ccc transparent",
            }}>
            <div className="sm:flex sm:items-start w-full h-full">
              {contents[selected]}
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-b-2xl flex flex-row-reverse sm:px-6">
            <button
              onClick={() => {
                selected !== 3 ? handleNext() : registerAccount();
              }}
              type="button"
              disabled={selected > 1 && !isAccepted}
              className={`${
                selected !== 3 ? "block" : "hidden"
              } inline-flex justify-center shadow-lg rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto`}>
              Suivant
            </button>
            <button
              onClick={handleSkip}
              type="button"
              className={`${
                selected > 2 ? "block" : "hidden"
              } mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg hover:scale-50 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto`}>
              Passer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
