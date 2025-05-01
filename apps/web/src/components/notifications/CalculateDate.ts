export class CalculateDate {
    public isToday(dateStr: string) {
        const date = new Date(dateStr);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    public isYesterday(dateStr: string) {
        const date = new Date(dateStr);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    };

    public isThisWeek(dateStr: string) {
        const date = new Date(dateStr);
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        return date >= startOfWeek && !this.isToday(dateStr) && !this.isYesterday(dateStr);
    };

    public isThisMonth(dateStr: string) {
        const date = new Date(dateStr);
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear() &&
            !this.isToday(dateStr) && !this.isYesterday(dateStr) && !this.isThisWeek(dateStr);
    };

    public formatNotificationTime(dateString: string) {
        const date = new Date(dateString);

        if (this.isToday(dateString)) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } else if (this.isYesterday(dateString)) {
            return "Yesterday";
        } else if (this.isThisWeek(dateString)) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        } else {
            const month = date.toLocaleString('default', { month: 'short' });
            return `${month} ${date.getDate()}, ${date.getFullYear()}`;
        }
    };
}

