export const 
checkout = (order) => {

   const API_KEY = import.meta.env.VITE_CINET_API_KEY;
   const SITE_ID = import.meta.env.VITE_CINET_SITE_ID;

   
    CinetPay.setConfig({
        apikey: API_KEY,//   YOUR APIKEY
        site_id: SITE_ID,//YOUR_SITE_ID
        notify_url: 'http://mondomaine.com/notify/',
        mode: 'PRODUCTION'
    });
    CinetPay.getCheckout(order);
    CinetPay.waitResponse(function(data) {
        if (data.status == "REFUSED") {
            if (alert("Votre paiement a échoué")) {
                window.location.reload();
            }
        } else if (data.status == "ACCEPTED") {
            if (alert("Votre paiement a été effectué avec succès")) {
                window.location.reload();
            }
        }
    });
    CinetPay.onError(function(data) {
        console.log(data);
    });
}