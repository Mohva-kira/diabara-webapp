import React from "react";
import { useNavigate } from "react-router-dom";

const Modal2 = ({ isActive, setIsActive, children }) => {
  const navigate = useNavigate();
  return (
    <div
      id="crypto-modal "
      tabIndex="-1"
      aria-hidden="true"
      className={`${
        isActive ? "block" : "hidden"
      }  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
      <div className="relative p-4 w-full max-w-2xl h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-[90%]  ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Abonnez vous et dites au revoir aux publicité
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crypto-modal"
              onClick={() => setIsActive(!isActive)}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div class="p-1 md:p-2 space-y-4 h-4/5">{children}</div>

          {/* Modal footer */}

          <div className="flex items-center p-4 md:p-5 space-x-4 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => navigate("/pricing")} // Changer de contenu au clic
              type="button"
              className={`"inline-flex w-full justify-center shadow-lg rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white  hover:bg-red-500 sm:ml-3 sm:w-auto"`}>
              S'abonner
            </button>
            <button
              // Action "Passer"
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg hover:scale-50 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
