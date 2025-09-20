import { registerLicense } from "@syncfusion/ej2-base";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { persistStore } from "redux-persist";
import App from "./App";
import "./index.css";
import { store } from "./redux/store";
// import serviceWorker from "./service-worker.js";

// const [isVisible, setIsVisible] = useState(false)


registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF5cWWNCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXhedHVVQmddUUJyXUA="
);
const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <Provider store={store}>
      {/* <Modal2 isActive={isVisible} setIsActive={setIsVisible}>
          <button id="install">
              Installer
          </button>
      </Modal2> */}
        <Router>
          <App />
        </Router>
   
    </Provider>

);
