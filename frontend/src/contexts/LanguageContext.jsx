import React, { createContext, useState, useEffect } from "react";

// Complete translations for all languages
const translations = {
    en: {
        common: {
            welcome: "Welcome",
            memberOf: "Member of",
            activeServices: "Active Services",
            provideFeedback: "Provide Feedback",
            viewDetails: "View Details",
            signUp: "Sign Up",
            login: "Login",
            logout: "Logout",
            joined: "Joined",
            active: "Active",
            at: "at",
            posted: "Posted",
            home: "Home",
            about: "About",
            contact: "Contact",
            Phone_Number: "Phone Number",
        },
        farmer: {
            homeTitle: "Farmer Dashboard",
            feedbackTitle: "Provide Service Feedback",
            noServicesFound: "No active services found",
            noServicesDescription: "You don't have any active services at the moment",
            exploreServices: "Explore Services",
            yourActiveServices: "Your Active Services",
            cooperativeAnnouncement: "Cooperative Announcement",
            upcomingMeeting: "Upcoming Meeting",
            meetingDetails: "The next cooperative meeting will be on",
            meetingLocation: "at the cooperative office",
            leadershipDiscussion: "leadership will discuss new farming techniques",
        },
        cooperative: {
            homeTitle: "Cooperative Dashboard",
            addFarmer: "Add New Farmer",
            location: "Location",
            locationNotSpecified: "Location not specified",
            cooperative: "Cooperative",
            totalFarmers: "Total Farmers",
            activeUsers: "Active Users",
            farmers: "farmers",
            noDescription: "No description available",
            serviceID: "Service ID",
        },
        feedback: {
            noServiceSelected: "No service selected",
            checkingEligibility: "Checking feedback eligibility...",
            feedbackFor: "Feedback for",
            couldNotVerify: "Could not verify feedback eligibility",
            submitSuccess: "Feedback submitted successfully!",
            submitFailed: "Failed to submit feedback",
            specificService: "Specific Service",
            specificServicePlaceholder: "specific type or breed of the service",
            rating: "Rating",
            yourFeedback: "Your Feedback",
            submitButton: "Submit Feedback",
            thankYouMessage: "Thank you for your feedback!",
            feedbackLimitReached:
                "You've reached the maximum feedback submissions (3) for this service. Please try again in {time}.",
        },
        sidebar: {
            adminPanel: "Admin Panel",
            coopPanel: "Cooperative Panel",
            dashboard: "Dashboard",
            insights: "Insights",
            services: "Services",
            cooperatives: "Cooperatives",
            farmers: "Farmers",
            communications: "Communications",
            visuals: "Visuals",
            recommendations: "Recommendations",
            reports: "Reports",
            addService: "Add Service",
            viewServices: "View Services",
            enableServices: "Enable Services",
            addCooperative: "Add Cooperative",
            editCooperative: "Edit Cooperative",
            viewCooperatives: "View Cooperatives",
            addFarmer: "Add Farmer",
            viewFarmers: "View Farmers",
            announcements: "Announcements",
        },
        landing: {
            welcomeTitle: "Welcome to Afran Qalloo FCU",
            subtitle: "Customer Satisfaction Analysis Platform",
            description:
                "Empowering better service delivery through real-time feedback and smart insights.",
        },
        landingCards: {
            coopSignup: "Sign Up as Cooperative",
            farmerSignup: "Sign Up as Farmer",
            coopLogin: "Login as Cooperative",
            farmerLogin: "Login as Farmer",
        },
    },
    or: {
        common: {
            welcome: "Baga nagaan dhuftan",
            memberOf: "Miseensa",
            activeServices: "Tajaajilawwan hojiirra jiran",
            provideFeedback: "Yaada kennuu",
            viewDetails: "Details ilaaluu",
            signUp: "Galmaa'uu",
            login: "Seensa",
            logout: "Ba'i",
            joined: "Galmaa'ee",
            active: "Hojii irra jira",
            at: "irratti",
            posted: "Maxxanfame",
            home: "Mana",
            about: "Waa'ee",
            contact: "Qunnamtii",
            Phone_Number: "Lakkoofsa Bilbilaa",
        },
        farmer: {
            homeTitle: "Farmerii Dashboorii",
            feedbackTitle: "Tajaajilaa Yaada Kennuu",
            noServicesFound: "Tajaajila hojii irraa hin argamne",
            noServicesDescription: "Yeroo ammaatti tajaajila hojii irraa hin qabdu",
            exploreServices: "Tajaajilaa qoqqooduu",
            yourActiveServices: "Tajaajilawwan kee Hojii irra jiran",
            cooperativeAnnouncement: "Beekumsa Waldaa",
            upcomingMeeting: "Marii Waldaa dhufu",
            meetingDetails: "Marii Waldaa itti aanu yeroo",
            meetingLocation: "biraatti ofiisaa Waldaa",
            leadershipDiscussion: "hogganoonni qorannoo qonnaa haaraa mariyatu",
        },
        cooperative: {
            homeTitle: "Waldaa Dashboorii",
            addFarmer: "Farmerii Haaraa Galmaa'uu",
            location: "Bakka",
            locationNotSpecified: "Bakka hin beekamne",
            cooperative: "Waldaa",
            totalFarmers: "Farmerota Waliigalaa",
            activeUsers: "Fayyadamaa Hojiirra Jiran",
            farmers: "farmeroota",
            noDescription: "Ibsa hin jiru",
            serviceID: "ID Tajaajilaa",
        },
        feedback: {
            noServiceSelected: "Tajaajilaa filatamtu hin jiru",
            checkingEligibility: "Yaada kennuu dandeessuu keessan mirkaneessaa...",
            feedbackFor: "Yaada",
            couldNotVerify:
                "Yaada kennuu dandeessuu keessan mirkaneessuu hindandeenye",
            submitSuccess: "Yaada keessan gaheera!",
            submitFailed: "Yaada kennuu hin dandeenye",
            specificService: "Tajaajilaa addaa",
            specificServicePlaceholder: "gosa addaa ykn gosa tajaajilaa",
            rating: "Qixxeessuu",
            yourFeedback: "Yaada keessan",
            submitButton: "Yaada ergaa",
            thankYouMessage: "Yaada kennuu keessan galatoomi!",
            feedbackLimitReached:
                "You've reached the maximum feedback submissions (3) for this service. Please try again in {time}.",
        },
        sidebar: {
            adminPanel: "Admin Paaneli",
            coopPanel: "Paaneelii Waldaa",
            dashboard: "Daashboordii",
            insights: "Hubannoo",
            services: "Tajaajilawwan",
            cooperatives: "Waldoota",
            farmers: "Farmeroota",
            communications: "Qunnamtii",
            visuals: "Mul'ifannoo",
            recommendations: "Gorsa",
            reports: "Ripoortii",
            addService: "Tajaajilaa Dabalachuu",
            viewServices: "Tajaajilawwan Ilaaluu",
            enableServices: "Tajaajilawwan Tumsuu",
            addCooperative: "Waldaa Dabalachuu",
            editCooperative: "Waldaa Gargaarsuu",
            viewCooperatives: "Waldoota Ilaaluu",
            addFarmer: "Farmerii Dabalachuu",
            viewFarmers: "Farmeroota Ilaaluu",
            announcements: "Beekumsa",
        },
        landing: {
            welcomeTitle: "Baga Nagaan Afran Qalloo FCU Geessan",
            subtitle: "Platformii Qorannoo Jaalatamummaa Makiinaa",
            description:
                "Tajaajila caalaa to'achuuf yaada yeroo dhugaa fi hubannoo garaan guddaa.",
        },
        landingCards: {
            coopSignup: "Waldaa Ta'uun Galmaa'uu",
            farmerSignup: "Farmerii Ta'uun Galmaa'uu",
            coopLogin: "Waldaa Ta'uun Seensuu",
            farmerLogin: "Farmerii Ta'uun Seensuu",
        },
    },
    am: {
        common: {
            welcome: "እንኳን ደህና መጡ",
            memberOf: "አባል",
            activeServices: "ንቁ አገልግሎቶች",
            provideFeedback: "ግብረ መልስ አስተያየት",
            viewDetails: "ዝርዝሮች ይመልከቱ",
            signUp: "ይመዝገቡ",
            login: "ግባ",
            logout: "ውጣ",
            joined: "ተጠቃሚ ሆኗል",
            active: "ንቁ",
            at: "በ",
            posted: "ተለጠፈ",
            home: "ዋና ገጽ",
            about: "ስለ እኛ",
            contact: "አግኙን",
            Phone_Number: "ስልክ ቁጥር",
        },
        farmer: {
            homeTitle: "ገበሬ ዳሽቦርድ",
            feedbackTitle: "ስለ አገልግሎት አስተያየት አርድ",
            noServicesFound: "ምንም ንቁ አገልግሎቶች አልተገኙም",
            noServicesDescription: "በአሁኑ ጊዜ ምንም ንቁ አገልግሎቶች የሎትም",
            exploreServices: "አገልግሎቶችን ይመልከቱ",
            yourActiveServices: "የእርስዎ ንቁ አገልግሎቶች",
            cooperativeAnnouncement: "የማኅበር ማስታወቂያ",
            upcomingMeeting: "የሚመጣ ስብሰባ",
            meetingDetails: "የሚቀጥለው የመህበር ስብሰባ በ",
            meetingLocation: "በማኅበሩ ቢሮ",
            leadershipDiscussion: "ሊዳርሽፕ አዳዲስ የሰርቻ ቴክኖሎጂዎችን ይዘረዝራል",
        },
        cooperative: {
            homeTitle: "ማኅበረ ዳሽቦርድ",
            addFarmer: "አዲስ ገበሬ ያስመዝግቡ",
            location: "ቦታ",
            locationNotSpecified: "ቦታ አልተገለጸም",
            cooperative: "ማኅበረ",
            totalFarmers: "ጠቅላላ ገበሬዎች",
            activeUsers: "ንቁ ተጠቃሚዎች",
            farmers: "ገበሬዎች",
            noDescription: "ምንም መግለጫ የለም",
            serviceID: "የአገልግሎት መታወቂያ",
        },
        feedback: {
            noServiceSelected: "ምንም አገልግሎት አልተመረጠም",
            checkingEligibility: "ግብረ መልስ ለመስጠት እስለጣሽ በመፈተሽ ላይ...",
            feedbackFor: "ግብረ መልስ ለ",
            couldNotVerify: "ግብረ መልስ  ለመስጠት የሚችሉ መሆንዎን ማረጋገጥ አልተቻለም",
            submitSuccess: "ግብረ መልስዎ በተሳካ ሁኔታ ቀርቧል!",
            submitFailed: "ግብረ መልስ ለመስጠት አልተቻለም",
            specificService: "ተወሰነ አገልግሎት",
            specificServicePlaceholder: "የተወሰነ ዓይነት ወይም ዝርያ አገልግሎት",
            rating: "ደረጃ መስጠት",
            yourFeedback: "የእርስዎ ግብረ መልስ",
            submitButton: "ግብረ መልስ ላክ",
            thankYouMessage: "ግብረ መልስዎን ስለላኩ እናመሰግናለን!",
            feedbackLimitReached:
                "ለዚህ አገልግሎት ከፍተኛውን የግብረመልስ አስገባት (3) ላደረሱ። እባክዎን ከ {time} በኋላ ይሞክሩ።",
        },
        sidebar: {
            adminPanel: "የአስተዳደር ፓነል",
            coopPanel: "የመህበር ፓነል",
            dashboard: "ዳሽቦርድ",
            insights: "እይታዎች",
            services: "አገልግሎቶች",
            cooperatives: "መህበራት",
            farmers: "ገበሬዎች",
            communications: "ግንኙነት",
            visuals: "ምስላዊ",
            recommendations: "ምክረ ሃሳቦች",
            reports: "ሪፖርቶች",
            addService: "አገልግሎት ያክሉ",
            viewServices: "አገልግሎቶችን ይመልከቱ",
            enableServices: "አገልግሎቶችን ያንቁ",
            addCooperative: "መህበር ያክሉ",
            editCooperative: "መህበር ያርትዑ",
            viewCooperatives: "መህበራትን ይመልከቱ",
            addFarmer: "ገበሬ ያክሉ",
            viewFarmers: "ገበሬዎችን ይመልከቱ",
            announcements: "ማስታወቂያዎች",
        },
        landing: {
            welcomeTitle: "ወደ አፍራን ቃሉ እንኳን በደህና መጡ",
            subtitle: "የደንበኛ እርካታ ትንታኔ መድረክ",
            description: "በቅጽበታዊ ግብረ መልስ እና ዘመናዊ ትንታኔ የተሻለ አገልግሎት ለመስጠት እያበረታታ ።",
        },
        landingCards: {
            coopSignup: "እንደ መህበር ይመዝገቡ",
            farmerSignup: "እንደ ገበሬ ይመዝገቡ",
            coopLogin: "እንደ መህበር ይግቡ",
            farmerLogin: "እንደ ገበሬ ይግቡ",
        },
    },
};

// Create context
export const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    // Load language preference from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("appLanguage");
        if (savedLanguage && translations[savedLanguage]) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Save language preference when it changes
    useEffect(() => {
        localStorage.setItem("appLanguage", language);
    }, [language]);

    // Translation function with nested key support
    const translate = (key) => {
        const keys = key.split(".");
        let result = translations[language];

        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                console.warn(`Missing translation for key: ${key}`);
                return key; // Return key if translation not found
            }
        }

        return result || key;
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                translate,
                availableLanguages: Object.keys(translations),
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook for easier usage
export const useLanguage = () => {
    const context = React.useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
