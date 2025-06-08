import { API_URL } from "@/lib/apiAuthRoutes";
import axios from "axios";

export async function fetchMyEvents(token: string) {

    try {
        const { data } = await axios.get(`${API_URL}/my-events`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data.data;
    } catch (err) {
        console.error("Error in fetching the events");
    }
}