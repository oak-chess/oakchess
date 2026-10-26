# Illustrated Idle environments

14 environments approved through `prototypes/idle-arena-studies`: Surge, Erika, Koga, Sabrina, Blaine, Giovanni, Lorelei, Bruno, Agatha, Lance, Hall of Fame, cave, sewer and haunted mansion.

Background art was created with the built-in image generation tool and exported to WebP at quality 88. Original source images and prompts remain in the local prototype folder (`SURGE-ART.md`, `PAINTED-ARENAS.md`, `REMAINING-ART.md`). These are original interpretive environment illustrations, not extracted anime backgrounds.

The shared renderer is `assets/illustrated-arenas.js`, loaded by Campaign/Tower and Idle. It replaces the scenery layer by exact native theme ID. Each live mode retains its existing gym, sector, event and hunt theme selection; the prototype's forced theme selector is deliberately not installed. Existing geometry, hitboxes, battle rules and save structures are unchanged. The WebP files are shared from `modes/idle/arena-art/`, without duplicate image copies. The old Idle adapter remains available for previously cached pages.

Surge uses the warm field surround tested in the prototype. Brock, Misty, Viridian forest, Rocket and the existing Kanto legendary renderers retain their current backgrounds. Regional additions are integrated separately in the Idle renderer, as described below.

Images load only when their theme is rendered. The renderer keeps at most four completed image entries and uses the original scenery while an image loads or if loading fails. Scenery is redrawn when the active theme's image finishes loading.

## Johto, Hoenn and legendary habitats

The Idle now adds 33 theme identities after the original native indices: eight Johto gyms, eight Hoenn gyms, six Johto legendary/mythical habitats, ten Hoenn habitats and Mew's own tropical clearing. `modes/idle/regional-arenas.js` registers their palettes and maps the 16 regional gyms. Hunt-specific cave, lake and other biome selections remain native. Legendary event routing resolves the species by name so an already scheduled event with an older numeric theme still reaches its new habitat. Mewtwo and the three birds keep their existing arenas.

`regional-art.js` lazily loads WebP backgrounds. `legend-decorations.js` draws the 17 illustrated habitat overlays around a solid native deck. `legend-decoration-layouts.js` contains precomputed visible bounds: local browsers do not need pixel-reading permissions. Each image cache keeps at most four habitats. Transparent surfaces are used only for the surrounding decoration; the field and rim remain opaque.

`arena-seal.js` preserves the birds' existing renderer and adds the progressive Pokéball emblem to the other approved native and regional themes. `special-crystals.js` replaces evolution stars on the 21 legendary/mythical species with an animated red or violet crystal, including allied units; reduced-motion preferences disable the animation. Common species retain their stars.

Legendary/mythical enemies now use level 300, P5, six IVs of 31 (186/186), neutral nature and the existing 2.5 boss multiplier. Ordinary encounter genes are never modified by the perfect event template. Already owned Pokémon keep their saved level and genes. These species use all four already registered moves in combat and their tooltip, independently of evolution stars. Existing event eligibility, schedules, rewards and unlock conditions remain unchanged.

The source illustrations and prompts remain in the local arena-study gallery. Production uses 33 background WebPs and 17 alpha WebPs, without publishing the gallery's isolated save fixture or forced theme selector.

Validation: `scripts/check-idle-regional-arenas.cjs` uses normal Chrome local-file permissions, checks all 33 environments and 17 overlays, and launches real Mew/Groudon events. `scripts/check-shared-arena-art-browser.cjs` covers Campaign and Tower regressions.
