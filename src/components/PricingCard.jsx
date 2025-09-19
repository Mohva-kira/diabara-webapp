import React from "react";
import { useNavigate } from "react-router-dom";

const PricingCard = ({item, handleSelect}) => {

  const {title, advantage, amount, finalAmount, duration, discount, isAvailable, isPopular, description } = item.attributes
  const navigate = useNavigate()

  const handleNextStep = () => {
    handleSelect(item)
    navigate('/payment')
  }
  return (
    <div className="lg:w-1/3 w-full  h-full  relative ">
      <div className="w-full p-[2px] h-full rounded-2xl  bg-orange-500 pt-16 border-orange-500 border">
        <div className="bg-blue-700 rounded-2xl top-10 h-full   w-full p-2">
          <div className="w-full flex justify-between m-2 p-2">
            <span className="w-5 h-5 rounded-full bg-slate-50 "> </span>
            <p className="p-2 bg-slate-50 w-fit h-fit rounded-2xl">
              Economise {discount}%
            </p>
          </div>

          <div className="flex flex-col">
            <h2 className="text-slate-100 font-bold">{title}</h2>
            <p className="text-slate-300">
             {description}
            </p>
          </div>

          <div className="w-full flex items-center">
            <h2 className="text-2xl p-2 text-white font-bold">{finalAmount} Fcfa</h2>{" "}
            <p className="text-md font-medium text-white items-end  ">pour {duration} mois</p>
          </div>

          <p className="text-orange-500 text-lg items-start font-light">
            +1 mois <span className="font-bold">GRATUIT</span>
          </p>

          <div className="p-2 m-1 flex flex-col">
            {advantage.split(',').map(item =>
            <span className="text-slate-100"> {item}</span>
              
            )}
            
          </div>

          
           <div onClick={() => handleNextStep()} className="w-full   absolute bottom-0 right-0 left-0  flex justify-center  p-2">
            <h2 className="bg-orange-400 cursor-pointer hover:bg-orange-500 w-full text-white p-1 text-center font-bold  rounded-3xl">
              S'abonner{" "}
            </h2>
          </div>

        </div>


      </div>
    </div>
  );
};

export default PricingCard;
