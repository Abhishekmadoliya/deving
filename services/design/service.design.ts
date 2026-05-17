

/**
 * design service to handle all the api calls related to design creaion and setup
 * such as 
 * - unique id session creation 
 * - design creation
 * - design setup
 * 
 */



import api from "@/lib/axios";
import { toast } from "sonner";

/**
 * @returns 
 */
export async function createUniqueSession(designPrompt: string) {
    try {
        const res = await api.post(`/api/design/create-session`, {
            designPrompt
        });
        if (res.status !== 200) {
            // toast.error(res?.data?.message || "Something went wrong")
            return null;
        }
        return res.data;
    } catch (error: any) {
        // toast.error(error?.response?.data?.message || "Something went wrong")
        return null;
    }
}


/**
 * @returns 
 */
export async function designCreation() {
    try {
        const res = await api.post("design/create-session");
        return res.data;
    } catch (error) {
        throw error;
    }
}



export async function getDesignSession(sessionId: string) {
    try {
        const res = await api.get(`/api/design/${sessionId}`);
        return res.data.data;
    } catch (error: any) {
        console.log("Error in getting design session", error?.response?.data?.message);
        throw error;
    }
}
