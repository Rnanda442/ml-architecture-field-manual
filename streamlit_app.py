import streamlit as st

PUBLIC_MANUAL_URL = "https://ml-architecture-field-manual.rnanda442.chatgpt.site"

st.set_page_config(
    page_title="ML Architecture Field Manual",
    page_icon="ML",
    layout="wide",
)

st.title("ML Architecture Field Manual")
st.caption("Public React manual embedded for Streamlit sharing.")
st.link_button("Open public manual", PUBLIC_MANUAL_URL)
st.components.v1.iframe(PUBLIC_MANUAL_URL, height=900, scrolling=True)
