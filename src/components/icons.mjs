const s = (d, extra = '') => `<svg class="ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${extra}>${d}</svg>`;
export const icons = {
  phone: s('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  pin: s('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  menu: s('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
  mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chevL: s('<path d="M15 5l-7 7 7 7"/>'),
  chevR: s('<path d="M9 5l7 7-7 7"/>'),
  facebook: s('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500A.5.500 0 0 1 14 8z"/>'),
  instagram: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>'),
  leaf: s('<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l7-7"/>'),
};
