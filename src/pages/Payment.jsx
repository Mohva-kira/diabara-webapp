import React, { useCallback, useEffect, useState } from "react";
import DetailsHeader from "../components/DetailsHeader";
import { checkout } from "../redux/services/cinetGateway";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { usePostSubscriptionMutation } from "../redux/services/subscription";
import { toast } from "react-toastify";

const Payment = () => {
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.auth);
  const subs = useSelector((state) => state.subs.subs);
  const params = useParams();
  const storageUser =
    localStorage.getItem("auth") && JSON.parse(localStorage.getItem("auth"));
  const [postSubs] = usePostSubscriptionMutation();
  console.log("params", params.type);
  console.log("subs", subs);
  const handleSubmit = useCallback((data) => {
    postSubs({ data }).then((res) => {
      console.log("Abonné effectué avec succès");
      toast.success("Abonné effectué avec succès");
      localStorage.removeItem("subs");
    });
  });

  useEffect(() => {
    if (params.type === "success") {
      let data = JSON.parse(localStorage.getItem("subs"));
      handleSubmit(data);
    }
  }, [params.type === "success"]);

  console.log("payment order", order);
  return (
    <div className="w-full   lg:h-96 h-full justify-between items-center sm:flex-row flex-col mt-4 mb-10">
      <div className="border-b-2 pb-2 border-orange-500">
        <h2 className="font-bold text-3xl text-white text-left"> Payment</h2>
      </div>

      <div className="lg:flex  w-full mt-4 h-full">
        <div className="w-full">
          <div className="w-full px-4">
            <h2 className="border-b text-white border-slate-50 py-1 mx-4">
              {" "}
              Adresse{" "}
            </h2>
            <div className="w-full border-b border-b-slate-50 justify-between px-4 py-1  ">
              <div
                className="relative mb-6 border-b-2 border-[1px] border-orange-500 rounded-2xl"
                data-te-input-wrapper-init>
                <input
                  type="email"
                  className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="exampleFormControlInput22"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="exampleFormControlInput22"
                  className={`pointer-events-none absolute  ${
                    email && "scale-[0.8] text-primary -translate-y-[2.15rem]"
                  } left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[2.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"`}>
                  Email
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 w-full">
          {" "}
          <div className="w-full rounded-2xl  lg:mt-0 mt-4   bg-blue-200/30">
            <div className="w-full flex flex-col justify-center items-center">
              <div className=" px-4 py-1.5">
                <h2 className="font-medium text-white text-xl">Total HT</h2>{" "}
                <h2 className="font-bold text-white text-2xl">1250 Fcfa</h2>
              </div>
            </div>
            <div className="flex w-full flex-col px-2 h-full ">
              <div className="flex justify-between py-2 px-4 text-white border-b border-orange-500 w-full">
                <h2 className="">Designation</h2>
                <h2>Durée</h2>
                <h2>Quantité</h2>
                <h2>Prix</h2>
              </div>

              <div className="flex ml-2 justify-between py-2 px-4 text-white border-b border-orange-500 w-full">
                <h2 className="">Standard</h2>
                <h2>1 mois</h2>
                <h2>1</h2>
                <h2>1000 </h2>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t-2  border-slate-50">
            <div
              disabled={!email}
              onClick={() => checkout(order.order)}
              className=" mt-4 md px-4 cursor-pointer flex justify-center items-center rounded-2xl text-white">
              <h2 className="bg-orange-400 cursor-pointer hover:bg-orange-500 w-64 text-white p-1 text-center font-bold  rounded-3xl">
                Finaliser l'abonnement
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
