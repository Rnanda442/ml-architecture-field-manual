import streamlit as st

PUBLIC_MANUAL_URL = "https://ml-architecture-field-manual.rnanda442.chatgpt.site"
GITHUB_URL = "https://github.com/Rnanda442/ml-architecture-field-manual"

st.set_page_config(
    page_title="ML Architecture Field Manual",
    page_icon="ML",
    layout="centered",
)

st.title("ML Architecture Field Manual")
st.caption(
    "Compact interactive presentation workspace for the public ML Architecture Field Manual."
)

st.write(
    "Open the canonical website for the full case explorer, architecture supplements, and source list."
)

col1, col2 = st.columns(2)
with col1:
    st.link_button("Open interactive manual", PUBLIC_MANUAL_URL, use_container_width=True)
with col2:
    st.link_button("GitHub", GITHUB_URL, use_container_width=True)
