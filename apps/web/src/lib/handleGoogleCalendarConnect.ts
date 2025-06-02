import { API_URL } from "./apiAuthRoutes"

export default function handleGoogleCalendarConnect(currentUrl: string) {
    const authUrl = `${API_URL}/oauth/google?returnUrl=${encodeURIComponent(
        currentUrl
    )}`;
    window.location.href = authUrl;
}