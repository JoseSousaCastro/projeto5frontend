import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next"; // Importe o I18nextProvider
import i18n from './translations'; // Importe o objeto i18n com suas configurações

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}> {/* Adicione o I18nextProvider em volta do componente App */}
      <App />
    </I18nextProvider>
  </BrowserRouter>
);
