export const APP_CONFIG = {
    business: {
        name: "Mandalas Hostal",
        email: "reservas@mandalas.com",
        phone: "+502 1234 5678",
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
