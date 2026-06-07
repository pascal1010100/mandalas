export const APP_CONFIG = {
    business: {
        name: "Mandalas Hostal",
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "mandalashostal@gmail.com",
        phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50232289507",
    },
    payment: {
        bankName: "BANRURAL",
        accountNumber: "3400055228",
        accountType: "Monetaria",
        currency: "GTQ"
    },
    defaults: {
        checkInTime: "14:00",
        checkOutTime: "11:00",
    }
};

export const ROUTES = {
    public: {
        home: "/",
        pueblo: "/pueblo",
        hideout: "/hideout",
        myBooking: "/my-booking",
    },
    admin: {
        dashboard: "/admin",
        login: "/admin/login",
    }
};
