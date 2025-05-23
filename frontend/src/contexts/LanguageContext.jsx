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
            location: "location",
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
            location: "bakka",
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
        },
        farmer: {
            homeTitle: "ገበሬ ዳሽቦርድ",
            feedbackTitle: "ስለ አገልግሎት አስተያየት አርድ",
            noServicesFound: "ምንም ንቁ አገልግሎቶች አልተገኙም",
            noServicesDescription: "በአሁኑ ጊዜ ምንም ንቁ አገልግሎቶች የሎትም",
            exploreServices: "አገልግሎቶችን ይመልከቱ",
            yourActiveServices: "የእርስዎ ንቁ አገልግሎቶች",
            cooperativeAnnouncement: "የብልጽግና ማስታወቂያ",
            upcomingMeeting: "የሚመጣ ስብሰባ",
            meetingDetails: "የሚቀጥለው ማህበር ስብሰባ በ",
            meetingLocation: "በብልጽግና ቢሮ",
            leadershipDiscussion: "ሊዳርሽፕ አዳዲስ የሰርቻ ቴኒኮችን ይዘረዝራል",
        },
        cooperative: {
            homeTitle: "ብልጽግና ዳሽቦርድ",
            addFarmer: "አዲስ ገበሬ ያስመዝግቡ",
            location: "ቦታ",
        },
        feedback: {
            noServiceSelected: "ምንም አገልግሎት አልተመረጠም",
            checkingEligibility: "ግብረ መልስ ለመስጠት እስለጣሽ በመፈተሽ ላይ...",
            feedbackFor: "ግብረ መልስ ለ",
            couldNotVerify: "ግብረ መልስ ለመስጠት የሚችሉ መሆንዎን ማረጋገጥ አልተቻለም",
            submitSuccess: "ግብረ መልስዎ በተሳካ ሁኔታ ቀርቧል!",
            submitFailed: "ግብረ መልስ ለመስጠት አልተቻለም",
            specificService: "ተወሰነ አገልግሎት",
            specificServicePlaceholder: "የተወሰነ ዓይነት ወይም ዝርያ አገልግሎት",
            rating: "ደረጃ መስጠት",
            yourFeedback: "የእርስዎ ግብረ መልስ",
            submitButton: "ግብረ መልስ ላክ",
            thankYouMessage: "ግብረ መልስዎን ስለላኩ እናመሰግናለን!",
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
