import React from "react";

const Confidentialite = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <h1 class="font-bold text-3xl mb-4 text-center">
        POLITIQUE DE CONFIDENTIALITÉ DE DIABARA.TV
      </h1>
      <div class="w-fit px-4 py-8 bg-white/60 rounded-2xl text-gray-800">
        <p class="text-sm text-gray-600 mb-8 text-center">
          Dernière mise à jour : 15/02/2025
        </p>

        <div class="max-w-4xl mx-auto">
          <h2 class="font-semibold text-xl mb-2">1. INTRODUCTION</h2>
          <p class="mb-4">
            La présente politique de confidentialité explique comment Diabara.tv
            collecte, utilise et protège les données personnelles des
            utilisateurs conformément aux normes internationales et aux
            exigences de l'Autorité de Protection des Données Personnelles
            (APDP) du Mali.
          </p>

          <h2 class="font-semibold text-xl mb-2">
            2. COLLECTE DES DONNÉES PERSONNELLES
          </h2>
          <p class="mb-4">
            Nous collectons les données suivantes : nom, adresse e-mail,
            informations de connexion, préférences de contenu et toute autre
            information nécessaire pour l'amélioration des services.
          </p>

          <h2 class="font-semibold text-xl mb-2">3. UTILISATION DES DONNÉES</h2>
          <p class="mb-4">
            Les données collectées sont utilisées pour fournir et améliorer nos
            services, personnaliser l'expérience utilisateur, et assurer la
            sécurité des comptes.
          </p>

          <h2 class="font-semibold text-xl mb-2">4. PARTAGE DES DONNÉES</h2>
          <p class="mb-4">
            Nous ne partageons pas les données personnelles des utilisateurs
            avec des tiers sans consentement, sauf obligation légale ou
            nécessité de prestation de services (ex. hébergement, paiement).
          </p>

          <h2 class="font-semibold text-xl mb-2">5. SÉCURITÉ ET CRYPTAGE</h2>
          <p class="mb-4">
            Les données sensibles sont stockées et protégées à l'aide de
            technologies de cryptage avancées pour éviter tout accès non
            autorisé.
          </p>

          <h2 class="font-semibold text-xl mb-2">6. DROITS DES UTILISATEURS</h2>
          <p class="mb-4">
            Conformément aux lois en vigueur, les utilisateurs ont le droit
            d'accéder, de modifier ou de supprimer leurs données personnelles en
            nous contactant à{" "}
            <a href="mailto:support@diabara.tv">📨 support@diabara.tv</a> .
          </p>

          <h2 class="font-semibold text-xl mb-2 uppercase">
            7. Utilisation des services de l’API YouTube
          </h2>
          <p class="mb-4">
            Notre application Diabara.tv utilise les services de l’API YouTube
            pour proposer du contenu vidéo et améliorer votre expérience
            utilisateur. En accédant à notre plateforme, vous acceptez d’être
            lié(e) par les{" "}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer">
              Conditions d’utilisation de YouTube
            </a>
            .
          </p>
          <p class="mb-4">
            Nous collectons et traitons certaines données lors de vos
            interactions avec les contenus YouTube intégrés, notamment :
          </p>
          <ul class="list-disc ml-6 mb-4">
            <li>
              Votre adresse IP pour optimiser l’affichage du contenu vidéo.
            </li>
            <li>
              Vos préférences et interactions (vues, pauses, lecture
              automatique) pour améliorer votre expérience.
            </li>
            <li>
              L’utilisation de cookies et de technologies similaires,
              conformément aux règles de YouTube et de Google.
            </li>
          </ul>
          <p class="mb-4">
            Pour plus d’informations sur la collecte et l’utilisation des
            données par Google, veuillez consulter la{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer">
              Politique de confidentialité de Google
            </a>
            .
          </p>
          <p class="mb-4">
            Conformément aux lois en vigueur, les utilisateurs ont le droit
            d'accéder, de modifier ou de supprimer leurs données personnelles en
            nous contactant à{" "}
            <a href="mailto:support@diabara.tv">📨 support@diabara.tv</a>.
          </p>

          <h2 class="font-semibold text-xl mb-2 uppercase">
            8. Gestion et consentement aux cookies
          </h2>
          <p class="mb-4">Nous utilisons des cookies pour :</p>
          <ul class="list-disc ml-6 mb-4">
            <li>
              Assurer le bon fonctionnement de l’application et des vidéos
              intégrées.
            </li>
            <li>Analyser l’audience et améliorer l’expérience utilisateur.</li>
            <li>Personnaliser le contenu et les recommandations vidéo.</li>
          </ul>
          <p class="mb-4">
            Vous pouvez gérer vos préférences de cookies via les paramètres de
            votre navigateur ou en utilisant notre bandeau de consentement
            affiché lors de votre première visite. Vous pouvez également refuser
            certains cookies sans compromettre l’accès aux fonctionnalités
            essentielles de notre service.
          </p>
          <p class="mb-4">
            Conformément aux lois en vigueur, les utilisateurs ont le droit
            d'accéder, de modifier ou de supprimer leurs données personnelles en
            nous contactant à{" "}
            <a href="mailto:support@diabara.tv">📨 support@diabara.tv</a>.
          </p>

          <h2 class="font-semibold text-xl mb-2">9. CONTACT</h2>
          <p class="mb-4">
            Pour toute question relative à cette politique de confidentialité,
            veuillez nous contacter à :{" "}
            <a href="mailto:support@diabara.tv">📨 support@diabara.tv</a> /{" "}
            <a href="tel:+22382796798">📱📞 +223 82 79 67 98</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;
