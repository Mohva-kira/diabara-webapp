import React, { useEffect, useState } from "react";
import PricingCard from "../components/PricingCard";
import { useGetTypeSubscriptionQuery } from "../redux/services/subscription";
import { useDispatch } from "react-redux";
import { setOrder } from "../redux/features/orderSlice";
import { setSubs } from "../redux/features/subscriptionSlice";

const Pricing = () => {
  const { data, isLoading, isFetching, isSuccess } =
    useGetTypeSubscriptionQuery();

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("auth"));

  console.log("order User", user?.user?.username);

  const handleSelect = (item) => {
    const {
      title,
      advantage,
      amount,
      finalAmount,
      duration,
      discount,
      isAvailable,
      isPopular,
      description,
    } = item.attributes;

    let oneYearFromNow = new Date();
    oneYearFromNow.setMonth(oneYearFromNow.getMonth() + 1);

    dispatch(
      setOrder({
        transaction_id: Math.floor(Math.random() * 100000000).toString(), // YOUR TRANSACTION ID
        amount: finalAmount,
        currency: "XOF",
        channels: "ALL",
        description: "Test de paiement",
        //Fournir ces variables pour le paiements par carte bancaire
        customer_name: "Joe", //Le nom du client
        customer_surname: "Down", //Le prenom du client
        customer_email: "down@test.com", //l'email du client
        customer_phone_number: user?.user?.username, //l'email du client
        customer_address: "BP 0024", //addresse du client
        customer_city: "Antananarivo", // La ville du client
        customer_country: "CM", // le code ISO du pays
        customer_state: "CM", // le code ISO l'état
        customer_zip_code: "06510", // code postal
      })
    );

    localStorage.setItem('subs', JSON.stringify({
      plan: title,
      amount: finalAmount,
      currency: 'xof',
      start_date: new Date(),
      end_date: oneYearFromNow,
      user: user?.user.id
    }))

    
    dispatch(  setSubs({
      plan: title,
      amount: finalAmount,
      currency: 'xof',
      start_date: new Date().toLocaleDateString('fr'),
      end_date: oneYearFromNow.toLocaleDateString('fr'),
      user: user?.user.id
    }))

  
  };
 


  useEffect(() => {
    dispatch(setOrder({}));
  }, []);
  return (
    <div className="w-full  space-x-2 ">
      <div className="w-full p-2 pt-10 items-center justify-center">
        <h2 className="w-full text-sm text-orange-500 font-light text-center">
          Nos offres
        </h2>
        <p className="w-full text-2xl text-white font-semibold text-center">
          Exclusivité. Illimité. Privilège.
        </p>
        <p className="w-full text-2xl text-white font-semibold text-center">
          Pour tout le monde
        </p>
        <p className="w-full text-lg text-slate-300 font-medium text-center">
          Rejoignez notre communauté d'auditeurs VIP et bénéficiez d'un accès
          exclusif à des fonctionnalités que vous ne trouverez nulle part
          ailleurs.
        </p>
      </div>
      <div className="w-full h-[560px] lg:flex lg:flex-wrap justify-center items-center lg:space-y-2 lg:space-x-2 pt-5 p-2 ">
        {data?.data.map((item) => (
          <PricingCard handleSelect={handleSelect} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;
