import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
    const [contact, setContact] = useState({
        whatsapp: '556132346622',
        whatsapp_display: '(61) 3234-6622',
        email: 'comercial@servweld.com.br'
    });

    useEffect(() => {
        const fetchContact = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'contact')
                .single();

            if (data && data.value) {
                setContact(data.value);
            }
        };

        fetchContact();
    }, []);

    return (
        <ContactContext.Provider value={contact}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContact must be used within a ContactProvider');
    }
    return context;
};
