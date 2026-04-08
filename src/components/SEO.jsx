import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, schema }) => {
    const siteTitle = "Servweld - Locação e Assistência Técnica de Solda";
    const fullTitle = title ? `${title} | Servweld` : siteTitle;
    const defaultDesc = "Líder em locação e manutenção de equipamentos de solda e corte. Atendemos com alta performance e suporte técnico especializado.";
    const currentDesc = description || defaultDesc;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={currentDesc} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={currentDesc} />
            <meta property="og:site_name" content="Servweld" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={currentDesc} />

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
            
            {/* Canonical link to avoid duplicate content issues */}
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
};

export default SEO;
