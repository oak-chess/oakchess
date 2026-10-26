# Illustrated Idle environments

14 environments approved through `prototypes/idle-arena-studies`: Surge, Erika, Koga, Sabrina, Blaine, Giovanni, Lorelei, Bruno, Agatha, Lance, Hall of Fame, cave, sewer and haunted mansion.

Background art was created with the built-in image generation tool and exported to WebP at quality 88. Original source images and prompts remain in the local prototype folder (`SURGE-ART.md`, `PAINTED-ARENAS.md`, `REMAINING-ART.md`). These are original interpretive environment illustrations, not extracted anime backgrounds.

The shared renderer is `assets/illustrated-arenas.js`, loaded by Campaign/Tower and Idle. It replaces the scenery layer by exact native theme ID. Each live mode retains its existing gym, sector, event and hunt theme selection; the prototype's forced theme selector is deliberately not installed. Existing geometry, hitboxes, battle rules and save structures are unchanged. The WebP files are shared from `modes/idle/arena-art/`, without duplicate image copies. The old Idle adapter remains available for previously cached pages.

Surge uses the warm field surround tested in the prototype. Brock, Misty, Viridian forest, Rocket and the existing legendary renderers retain their current backgrounds. Johto and Hoenn still reuse native themes until their separately planned arenas are made.

Images load only when their theme is rendered. The renderer keeps at most four completed image entries and uses the original scenery while an image loads or if loading fails. Scenery is redrawn when the active theme's image finishes loading.
