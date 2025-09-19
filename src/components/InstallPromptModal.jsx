import { useEffect, useState } from "react";
import {
  useGetVisitorsByUUIDQuery,
  useUpdateVisitorMutation,
} from "../redux/services/visitor";

export default function InstallPromptModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [updateVisitor] = useUpdateVisitorMutation();

  const deviceID = localStorage.getItem("uuid");

  console.log("deviceID", deviceID);

  const {
    data: visitorData,
    isLoading: visitorLoading,
    isFetching: visitorFetching,
    isSuccess: visitorSuccess,
  } = useGetVisitorsByUUIDQuery(deviceID);

  console.log("visitorData", visitorData?.data[0]);

  const updateVisitorData = async () => {
    try {
      console.log("updateVisitorData");

      // Vérification si les données du visiteur existent
      if (!visitorData || !visitorData.data || visitorData.data.length === 0) {
        console.log("No visitor data found");
        return;
      }

      console.log("visitorData", visitorData);

      // Préparation des données à mettre à jour
      const data = {
        id: visitorData.data[0].id,
        installed: true,
        visited: true,
        location: window.navigator.geolocation || null, // Ajout d'une vérification pour éviter les erreurs
      };

      console.log("data", data);

      // Mise à jour des données du visiteur
      await updateVisitor(data);
      console.log("Visitor data updated successfully");
    } catch (error) {
      console.error("Error updating visitor data:", error);
    }
  };

  useEffect(() => {
    console.log("Initializing InstallPromptModal");

    const handler = (e) => {
      console.log("beforeinstallprompt event fired", e);

      e.preventDefault(); // Empêche l'affichage automatique de la boîte de dialogue d'installation
      setDeferredPrompt(e);
      setShowModal(true);
    };

    // Vérifiez si l'événement est supporté
    if (window) {
      window.addEventListener("beforeinstallprompt", handler);
    }

    // Nettoyage des écouteurs lors du démontage du composant
    return () => {
      if (window) {
        window.removeEventListener("beforeinstallprompt", handler);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log("User choice:", result.outcome);

      setShowModal(false);
      setDeferredPrompt(null);
      updateVisitorData();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center transition transform scale-100">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Installer l'application ?
        </h2>
        <p className="text-gray-600 mb-5">
          Installer DIABARATV sur votre écran d'accueil pour une meilleure
          expérience.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleInstall}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
            Installer
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
