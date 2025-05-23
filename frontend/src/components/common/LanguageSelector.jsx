// src/components/common/LanguageSelector.jsx
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSelector = () => {
    const { language, setLanguage, availableLanguages } = useLanguage();

    const languageNames = {
        en: "English",
        or: "Oromifa",
        am: "አማርኛ",
    };

    return (
        <div className="fixed top-18 right-4 z-50">
            <div className="inline-flex rounded-md shadow-sm bg-green-600">
                {availableLanguages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-4 py-2 text-sm font-medium ${language === lang
                                ? "bg-orange-400 text-white"
                                : "bg-green text-white hover:bg-green-700"
                            } ${lang === availableLanguages[0]
                                ? "rounded-l-lg"
                                : lang === availableLanguages[availableLanguages.length - 1]
                                    ? "rounded-r-lg"
                                    : ""
                            }`}
                    >
                        {languageNames[lang]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;
