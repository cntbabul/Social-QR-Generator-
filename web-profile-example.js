import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();
    const { ig, wa, web, name, message } = router.query;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>{name || "Connect with me"}</h1>
                {message && <p style={styles.message}>{message}</p>}

                <div style={styles.buttonContainer}>
                    {wa && (
                        <a href={`https://wa.me/${wa}`} style={{ ...styles.button, ...styles.whatsapp }}>
                            Chat on WhatsApp
                        </a>
                    )}

                    {ig && (
                        <a href={`https://instagram.com/${ig}`} style={{ ...styles.button, ...styles.instagram }}>
                            Follow on Instagram
                        </a>
                    )}

                    {web && (
                        <a href={web.startsWith('http') ? web : `https://${web}`} style={{ ...styles.button, ...styles.website }}>
                            Visit Website
                        </a>
                    )}
                </div>
            </div>

            <footer style={styles.footer}>
                <p>Scanned via QR</p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '20px',
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        marginBottom: '8px',
        color: '#1a1a1a',
    },
    message: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '32px',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    button: {
        display: 'block',
        padding: '16px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '16px',
        transition: 'transform 0.2s',
    },
    whatsapp: {
        background: '#25D366',
        color: 'white',
    },
    instagram: {
        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
        color: 'white',
    },
    website: {
        background: '#333',
        color: 'white',
    },
    footer: {
        marginTop: '32px',
        color: '#888',
        fontSize: '12px',
    }
};
