export default function handleGoogleCalendarConnect(currentUrl: string) {
    const authUrl = `http://localhost:7001/api/auth/google?returnUrl=${encodeURIComponent(
        currentUrl
    )}`;
    window.location.href = authUrl;
}