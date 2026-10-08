# Cinematic revision 3 — horizontal product navigation

Preserves the approved intro, brand environment, product pose and retail content. Replaces the tall vertical color narrative with a native horizontal snap rail. Whole product photographs move sideways: horizontal trackpad/wheel, native touch swipe, mouse drag, arrow buttons, ArrowLeft/ArrowRight/Home/End. Direct finish buttons jump immediately. No color interpolation, crossfade or recoloring filter. Vertical scrolling only navigates the page; it never selects a finish. Shorter hero removes the previous extra scrolling distance and hidden handoff; existing hero CTA links to actual store content.

Dark Cherry was edited with ImageGen to a deeper burgundy, preserving camera details and framing, then exported losslessly at 1024×1536. Other photographs and intro code are unchanged.

Validation: desktop 1440×900, mobile 390×844 (native browser touch events), additional 320×780/375×667/768×1024 ready-state layouts, horizontal wheel, pointer drag, arrow and keyboard navigation, direct selection, vertical independence, live reduced-motion, no-JS, menu/real CTA anchor, lifecycle and idle RAF. Lower documentary chapters remain byte-identical to revision 2. Evidence: qa/cinematic-v3-result.json, qa/v3-*.png, qa/cinematic-v3-demo.webm; shared results in ../cinematic-v3-qa.json and publication provenance in ../cinematic-v3-publication.json.

Photographic 2.5D remains the established rendering method; browser emulation does not establish physical-device GPU or field CWV.
