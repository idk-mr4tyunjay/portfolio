PLUM STUDIO / REALTIME ASSETS

scene.glb is the optimized final visible Blender scene: 108,040 triangles,
nine material groups, EXT_meshopt_compression. Its binary is 1,371,616 bytes.
The editable source and high-density rig are not shipped to the browser.

scene.json supplies linear RGB material colors, a light direction, 121
camera samples and the monitor's four world-space corners. Coordinates
use glTF / Three.js Y-up. Quaternions use x,y,z,w. Horizontal field of view
is in radians. Screen corners are top-left, top-right, bottom-right,
bottom-left when viewed through the authored camera.

StudioScene.tsx recreates toon materials from that metadata and renders
only on progress/viewport changes. Geometry creates the graphic shadow.
Screen content is a separately replaceable 16:9 image at screen.png.
The screen texture uses standard glTF UVs (Three.js flipY = false).

The camera ends with the screen filling a 16:9 view. Portrait openings
use a closer crop and ease into the authored framing during the approach.
Use onScreenChange for the DOM handoff at every viewport aspect ratio.
poster.png is the static loading/error/reduced-motion fallback.

See ATTRIBUTION.txt for the adapted Snow character's CC BY 4.0 credit.
