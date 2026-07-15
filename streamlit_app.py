"""Streamlit Community Cloud entry point for the ML Architecture Field Manual."""

import streamlit as st
import streamlit.components.v1 as components

MANUAL_URL = "https://ml-architecture-field-manual.rnanda442.chatgpt.site"

st.set_page_config(
    page_title="ML Architecture Field Manual",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      .stApp { background: #f3f0e7; }
      .block-container { max-width: 1500px; padding: 0.75rem 1rem 2rem; }
      header[data-testid="stHeader"] { background: transparent; }
      .manual-note {
        display:flex; align-items:center; justify-content:space-between; gap:16px;
        padding:10px 14px; margin:0 0 10px; border:1px solid #d7d4ca;
        border-radius:10px; background:#fff; color:#24302b; font:14px Arial,sans-serif;
      }
      .manual-note a { color:#163d34; font-weight:700; }
    </style>
    <div class="manual-note">
      <span><b>ML Architecture Field Manual</b> · interactive DOE fellowship edition</span>
      <a href="https://ml-architecture-field-manual.rnanda442.chatgpt.site" target="_blank">Open full screen ↗</a>
    </div>
    """,
    unsafe_allow_html=True,
)

components.iframe(MANUAL_URL, height=1150, scrolling=True)

st.caption("If browser privacy settings block the embedded manual, use “Open full screen” above.")
