import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Header,
  MusicPlayer,
  RequireAuth,
  Sidebar,
  TopPlay,
} from "./components";
import {
  AddSong,
  Adhesion,
  AroundYou,
  ArtistAccount,
  ArtistDetails,
  Auth,
  Discover,
  Features,
  Pricing,
  Search,
  SongDetails,
  TopArtists,
  TopCharts,
} from "./pages";

import { HelmetProvider } from "react-helmet-async";
import { BsFileMusicFill } from "react-icons/bs";
import ReactPWAInstallProvider, { useReactPWAInstall } from "react-pwa-install";
import "react-toastify/dist/ReactToastify.css";
import { initGA, logEvent, logPageView } from "./analytics";
import RequireSub from "./components/RequireSub";
import CGU from "./pages/CGU";
import Confidentialite from "./pages/Confidentialite";
import Favourites from "./pages/Favourites";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Video from "./pages/Video";

const App = () => {
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  ReactGA.initialize("G-YQKY9V1351");

  const handleClick = () => {
    pwaInstall({
      title: "Install Web App",
      logo: myLogo,
      features: (
        <ul>
          <li>Cool feature 1</li>
          <li>Cool feature 2</li>
          <li>Even cooler feature</li>
          <li>Works offline</li>
        </ul>
      ),
      description: "This is a very good app that does a lot of useful stuff. ",
    })
      .then(() =>
        alert("App installed successfully or instructions for install shown")
      )
      .catch(() => alert("User opted out from installing"));
  };

  const { activeSong } = useSelector((state) => state.player);
  //  console.log('api', process.env.REACT_APP_API_URL)
  let url = useLocation();
  const isCompleted = window.location;

  useEffect(() => {
    setIsVisible(true);
  }, [activeSong]);

  useEffect(() => {
    initGA();

    logEvent("Page", "View", "Home Page ");
    const onPageLoad = () => {
      console.log("page loaded");
      url = window.location.href;

      // do something else
    };
    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();

      logPageView();
    } else {
      window.addEventListener("load", onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  // alert(window.screen.width)
  // console.log('pwaaaa', isInstalled, supported)
  useEffect(() => {
    initGA();
    ReactGA.send({
      hitType: "pageview",
      page: window.location.href,
      title: window.location.pathname,
    });
    console.log("ga log", window.location.pathname);
  }, []);

  const helmetContext = {};

  return (
    <div className="relative flex">
      <HelmetProvider context={helmetContext}>
        <Sidebar />
        <ToastContainer />
        <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
          <Header />

          <div className="px-2 overflow-y-scroll hide-scrollbar flex flex-col-reverse xl:flex-row h-[calc(100vh-140px)] sm:h-[calc(100vh-70px)]">
            {supported && !isInstalled && (
              <div onClick={handleClick}>Install App</div>
            )}
            <div className="flex-1 h-fit pb-0 px-2">
              <ReactPWAInstallProvider enableLogging>
                <Routes>
                  <Route path="/" element={<Discover />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/blog/features" element={<Features />} />
                  <Route path="/songs/add" element={<AddSong />} />
                  <Route path="/top-artists" element={<TopArtists />} />
                  <Route path="/top-charts" element={<TopCharts />} />
                  <Route path="/around-you" element={<AroundYou />} />
                  <Route path="/adhesion" element={<Adhesion />} />
                  <Route path="/terms-of-service" element={<CGU />} />
                  <Route path="/privacy-policy" element={<Confidentialite />} />
                  <Route element={<RequireAuth />}>
                    <Route element={<RequireSub />}>
                      <Route path="/favourites" element={<Favourites />} />
                      <Route path="/artists/:id" element={<ArtistDetails />} />
                      <Route path="/artist/:id" element={<ArtistAccount />} />
                      <Route path="/video/:id" element={<Video />} />
                    </Route>
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/:type" element={<Payment />} />
                  </Route>

                  <Route path="/songs/:songid" element={<SongDetails />} />
                  <Route path="/search/:searchTerm" element={<Search />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route
                    path="/politique-confidentialite"
                    element={<Confidentialite />}
                  />
                </Routes>
              </ReactPWAInstallProvider>
            </div>
            <div className="xl:sticky relative top-0 h-fit">
              {url.pathname.includes("/blog") ||
              url.pathname.includes("/login") ||
              url.pathname.includes("/artist") ||
              url.pathname.includes("/adhesion") ||
              url.pathname.includes("/politique-confidentialite") ||
              url.pathname.includes("/terms-of-service") ||
              url.pathname.includes("/payment") ? null : (
                <TopPlay />
              )}
            </div>
          </div>
        </div>

        {activeSong?.attributes?.name && (
          <div
            className={`${
              isVisible ? "flex flex-col" : "hidden"
            } fixed bottom-0 left-0 right-0 w-full h-32 z-50 items-center justify-between px-6 backdrop-blur-md bg-gradient-to-r from-[#1c1c6e] via-[#2e2e88] to-[#3a3a9c] rounded-t-3xl shadow-2xl`}>
            <MusicPlayer setIsVisible={setIsVisible} />

            {!isVisible && (
              <div
                onClick={() => setIsVisible(true)}
                className="fixed bottom-10 right-12 z-50 text-white text-3xl cursor-pointer">
                <BsFileMusicFill />
              </div>
            )}
          </div>
        )}
      </HelmetProvider>
    </div>
  );
};

export default App;
