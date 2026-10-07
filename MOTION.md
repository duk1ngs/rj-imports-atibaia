# Revisão 2026-10-07

Zoom Parallax contido nas duas camadas existentes do hero; ampliação principal máxima configurada 1.12, inset 1.035, deslocamento -20px; entradas de material e botões quentes.

Identidade, dados de contato, fotos originais e favicons preservados. Intros continuam curtas, puláveis e uma vez por sessão. Conteúdo funciona sem JavaScript.

Motion simplificado no mobile e removido com movimento reduzido. Spotlight somente pointer fino/hover e viewport >800px; Zoom sem captura de scroll, com pausa fora da tela, em aba oculta e função de descarte. Não há React, shadcn ou biblioteca de animação instalada.

Verificação local: desktop 1440×1000 e mobile 390×844, imagens, overflow, galeria/seleção contextual quando presentes, menu/Escape, contatos, reduced motion, intro/skip/session/no-JS e sintaxe JavaScript. Spotlight/Zoom tiveram testes adicionais de resposta, preferência dinâmica, cleanup e ausência de RAF contínuo em repouso.

Scroll Expansion Hero foi encontrado no registro anterior sem fonte física; não foi recriado, instalado nem apresentado como validado. QA e evolução da biblioteca ficam no workspace da coleção, fora da hospedagem.

## Perspective Container Scroll — 2026-10-07

Native `dist/container-scroll.js`, no new runtime dependencies. One framed media panel, controls outside; existing intro/reveal/Spotlight/Zoom remain. Validated desktop 1440/mobile390, no-JS, dynamic reduced motion, progression, teardown, offscreen suspension and no idle RAF. Strict checkJs used shared declaration. Local evidence: ../container-qa.json and qa/container-progress.png; CPU callbacks measured separately from GPU/CWV.
