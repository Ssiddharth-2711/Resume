import streamlit as st
import streamlit.components.v1 as components
import base64
from pathlib import Path
import re

# Page configuration
st.set_page_config(
    page_title="Siddharth Sahu | AI/ML Engineer • Full Stack Developer",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Streamlit UI overrides to allow full-screen immersive display
st.markdown("""
<style>
    /* Hide Streamlit default headers, footers and margins */
    header[data-testid="stHeader"], footer, #MainMenu, [data-testid="stToolbar"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
    }
    
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        background-color: #0B0F19 !important;
    }
    
    [data-testid="stAppViewContainer"], [data-testid="stApp"] {
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        background-color: #0B0F19 !important;
    }

    [data-testid="stMainBlockContainer"], .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
    }

    [data-testid="stCustomComponentV1"] {
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    iframe {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        border: none !important;
        display: block !important;
        z-index: 999999 !important;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def get_bundled_portfolio():
    root = Path(__file__).parent
    index_path = root / "index.html"
    css_path = root / "css" / "style.css"
    particles_path = root / "js" / "particles.js"
    main_js_path = root / "js" / "main.js"
    images_dir = root / "assets" / "images"

    html = index_path.read_text(encoding="utf-8")
    css = css_path.read_text(encoding="utf-8")
    particles_js = particles_path.read_text(encoding="utf-8")
    main_js = main_js_path.read_text(encoding="utf-8")

    # Inline CSS
    html = re.sub(
        r'<link rel="stylesheet" href="css/style\.css">',
        f'<style>\n{css}\n</style>',
        html
    )

    # Inline Images as Base64 Data URIs
    for img_file in images_dir.glob("*.jpg"):
        b64 = base64.b64encode(img_file.read_bytes()).decode("utf-8")
        data_uri = f"data:image/jpeg;base64,{b64}"
        rel_path = f"assets/images/{img_file.name}"
        html = html.replace(rel_path, data_uri)

    # Inline JavaScript files
    html = re.sub(
        r'<script src="js/particles\.js"></script>',
        f'<script>\n{particles_js}\n</script>',
        html
    )
    html = re.sub(
        r'<script src="js/main\.js"></script>',
        f'<script>\n{main_js}\n</script>',
        html
    )

    return html

# Render bundled full-screen portfolio inside Streamlit
portfolio_markup = get_bundled_portfolio()
components.html(portfolio_markup, height=1000, scrolling=True)
