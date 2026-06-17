import useAuthStore from "../store/useAuthStore.js";
import toast from "react-hot-toast";
let timeoutId = null;
const subscribeToBroadcast = () => {
    const socket = useAuthStore.getState().socket;
    if(timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(()=>{
        unSubscribeToBroadcast();
    }, 32000);
    if(socket.hasListeners("statusUpdate")) return;
    socket.on("statusUpdate", ({_id, status, verdict})=>{
        console.log("Received status update:", {_id, status, verdict});
        if(verdict){
            if(verdict=="Accepted"){
                toast.success(`${verdict}`,{
                    id: _id,
                    duration: 3000
                });
            }else{
                toast.error(`${status}`,{
                    id: _id,
                    duration: 3000
                });
            }
        }else if(status){
            toast.loading(`${status}`,{
                id: _id,
                duration: 5000
            });
        }
    })
}

const unSubscribeToBroadcast = () => {
    const socket = useAuthStore.getState().socket;
    socket.off("statusUpdate");
    timeoutId = null;
}

export {
    subscribeToBroadcast,
    unSubscribeToBroadcast
}