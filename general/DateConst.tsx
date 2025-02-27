import moment from 'moment';

export const compareDates = (dateString: string): number => {
    const today = moment().startOf('day');
    const compareDate = moment(dateString).startOf('day');
    if (today.isBefore(compareDate)) return -1;
    if (today.isAfter(compareDate)) return 1;
    return 0;
};

export const getCurrentDay = (): number => {
    return moment().startOf('day').valueOf();
};

export const getDateTimestamp = (dateString: string): number => {
    return moment(dateString).startOf('day').valueOf();
};

export const formatDateTime = (dateTimeString: string): string => {
    try {
        const date = new Date(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    } catch (error) {
        return dateTimeString;
    }
};

export const getCurrentTime = (): string => {
    const now = new Date();
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

export const getCurrentWeek = (): number => {
    return moment().week();
};

export const getCurrentWeekYear = (): { week: number; year: number } => {
    const now = moment();
    return {
        week: now.week(),
        year: now.year()
    };
};

export const getWeekOfDate = (dateString: string): { week: number; year: number } => {
    const date = moment(dateString);
    return {
        week: date.week(),
        year: date.year()
    };
};

export const getCurrentMonthYear = (): { month: number; year: number } => {
    const now = moment();
    return {
        month: now.month() + 1, // moment trả về tháng từ 0-11 nên cần +1
        year: now.year()
    };
};

export const getMonthYearOfDate = (dateString: string): { month: number; year: number } => {
    const date = moment(dateString);
    return {
        month: date.month() + 1, // moment trả về tháng từ 0-11 nên cần +1
        year: date.year()
    };
};

export const compareTwoDates = (date1: string, date2: string): number => {
    const firstDate = moment(date1);
    const secondDate = moment(date2);
    
    if (firstDate.isSame(secondDate, 'day')) return 0;
    if (firstDate.isBefore(secondDate, 'day')) return -1;
    return 1;
};

export const compareTwoWeeks = (date1: string, date2: string): number => {
    const firstDate = moment(date1);
    const secondDate = moment(date2);
    
    const week1 = firstDate.week();
    const week2 = secondDate.week();
    const year1 = firstDate.year();
    const year2 = secondDate.year();
    
    if (year1 < year2) return -1;
    if (year1 > year2) return 1;
    
    if (week1 < week2) return -1;
    if (week1 > week2) return 1;
    return 0;
};

export const compareTwoMonths = (date1: string, date2: string): number => {
    const firstDate = moment(date1);
    const secondDate = moment(date2);
    
    const month1 = firstDate.month();
    const month2 = secondDate.month();
    const year1 = firstDate.year();
    const year2 = secondDate.year();
    
    if (year1 < year2) return -1;
    if (year1 > year2) return 1;
    
    if (month1 < month2) return -1;
    if (month1 > month2) return 1;
    return 0;
};
