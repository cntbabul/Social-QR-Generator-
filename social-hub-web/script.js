document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Params from URL
    const params = new URLSearchParams(window.location.search);

    // 2. Extract Data
    const name = params.get('name') || "My Profile";
    const wa = params.get('wa');
    const ig = params.get('ig');
    const web = params.get('web');
    const msg = params.get('msg');
    // Add more providers as needed (fb, li, tw, gh)
    const fb = params.get('fb');
    const li = params.get('li');
    const tw = params.get('tw');
    const gh = params.get('gh');

    // 3. Update DOM
    document.title = `${name} | Links`;
    document.getElementById('userName').textContent = name;

    if (msg) {
        document.getElementById('userMessage').textContent = msg;
    }

    const container = document.getElementById('linksContainer');

    function addLink(url, iconClass, text, colorClass) {
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.className = `link-btn ${colorClass}`;
        a.target = "_blank";
        a.innerHTML = `<i class="${iconClass}"></i> ${text}`;
        container.appendChild(a);
    }

    // 4. Inject Links
    // WhatsApp
    if (wa) {
        addLink(`https://wa.me/${wa}`, "fab fa-whatsapp", "Chat on WhatsApp", "whatsapp");
    }

    // Instagram
    if (ig) {
        addLink(`https://instagram.com/${ig}`, "fab fa-instagram", "Follow on Instagram", "instagram");
    }

    // Facebook
    if (fb) {
        addLink(`https://facebook.com/${fb}`, "fab fa-facebook-f", "View on Facebook", "facebook");
    }

    // LinkedIN
    if (li) {
        addLink(`https://linkedin.com/in/${li}`, "fab fa-linkedin-in", "Connect on LinkedIn", "linkedin");
    }

    // Twitter
    if (tw) {
        addLink(`https://twitter.com/${tw}`, "fab fa-twitter", "Follow on X", "twitter");
    }

    // GitHub
    if (gh) {
        addLink(`https://github.com/${gh}`, "fab fa-github", "View Code on GitHub", "github");
    }

    // Website (Generic)
    if (web) {
        let cleanUrl = web;
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = `https://${cleanUrl}`;
        }
        addLink(cleanUrl, "fas fa-globe", "Visit Website", "website");
    }

    // Fallback if no links
    if (container.children.length === 0) {
        container.innerHTML = '<p style="opacity:0.5;">No links added yet.</p>';
    }
});

function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
}
