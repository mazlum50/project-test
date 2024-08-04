import React, { useContext, useState, useEffect } from 'react';
import '../styles/ausflugCard.css';
import { useNavigate } from "react-router-dom";
import { SlCalender, SlLocationPin } from "react-icons/sl";
import UserContext from "../UserContext.jsx";
import Popup from "./Popup.jsx";
import PopupAnmeldenRegistrieren from "./PopupAnmeldenRegistrieren.jsx";

const AusflugCard = ({ ausflug, baseUrl }) => {
    const [bildSrc, setBildSrc] = useState('');
    const navigate = useNavigate();
    const { benutzer } = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false);

    const handlePopupAnmelden = () => {
        setShowPopup(false);
        navigate(`/login`);
    };

    const handlePopupRegistrieren = () => {
        setShowPopup(false);
        navigate(`/signup`);
    };

    const handleClick = () => {
        if (benutzer) {
            navigate(`/ausflug-seite/${ausflug.id}`, { state: { ausflug } });
        } else {
            setShowPopup(true);
        }
    };

    useEffect(() => {
        const fetchBild = async () => {
            if (ausflug.hauptBild?.imageUrl) {
                setBildSrc(ausflug.hauptBild.imageUrl);
            } else {
                try {
                    const response = await fetch(`${baseUrl}/api/ausflugbild/ausflug/${ausflug.id}`);
                    if (response.ok) {
                        const blob = await response.blob();
                        const objectURL = URL.createObjectURL(blob);
                        setBildSrc(objectURL);
                    } else {
                        console.error("Fehler nach der Bild abfrage:", response.statusText);
                    }
                } catch (error) {
                    console.error('Fehler vor der Bildabfrage:', error);
                }
            }
        };

        fetchBild();
    }, [ausflug, baseUrl]);

    return (
        <div className="ausflug-card" onClick={handleClick}>
            <div className="ausflug-card-bild" style={{ backgroundImage: `url(${bildSrc})` }}></div>
            <div className="ausflug-card-content">
                <h2 className="ausflug-card-content-h2">{ausflug.titel}</h2>
                <div className="ausflug-card-info">
                    <SlCalender className="ausflug-card-icon" />
                    <span>{ausflug.ausflugsdatum.replace("T", " ").slice(0, 16)}</span>
                </div>
                <div className="ausflug-card-info">
                    <SlLocationPin className="ausflug-card-icon" />
                    <span>{ausflug.reiseziel}</span>
                </div>
            </div>
            {showPopup && (
                <PopupAnmeldenRegistrieren
                    title="Bitte melde dich an oder registriere dich, um den Ausflug anzusehen."
                    description=""
                    onCancel={handlePopupRegistrieren}
                    onConfirm={handlePopupAnmelden}
                    cancelText="Registrieren"
                    confirmText="Anmelden"
                />
            )}
        </div>
    );
};

export default AusflugCard;
