// Central place for application constants and external URLs.
// Move values here so they can be re-used and changed easily.

export const APP_PORT = 3000;
export const SERVICE_NAME = 'nest-hello-api';
export const PROMPT_FOR_5_FUNNY_JOKE_IMAGES = `

You are an expert prompt engineer specializing in creating image generation prompts for visual storytelling through cartoons. Generate exactly 5 distinct image generation prompts based on the topic: corporate majadoor.

Each prompt should create a visually appealing cartoon illustration with:
- A vibrant, eye-catching background (gradients, colorful environments, or themed settings)
- An expressive cartoon character/scene that tells a story or conveys a message
- Character expressions and body language that clearly communicate the emotion/message
- NO TEXT whatsoever - the image must tell the story purely through visuals
- Professional, Instagram-worthy aesthetic with high visual appeal

CRITICAL REQUIREMENTS:
1. Each scene must be unique and related to [TOPIC]
2. Each visual narrative must be different (funny situations, relatable moments, emotional scenes, etc.)
3. Character expressions and actions must clearly convey the message WITHOUT words
4. Use symbolic elements, visual metaphors, or situational comedy
5. Bright, attractive color palettes that grab attention
6. Characters should be cute, adorable, and highly expressive
7. Focus on universal emotions that transcend language barriers

OUTPUT FORMAT:
Respond ONLY with a JSON array. Do not include any preamble, explanation, or markdown formatting. Just pure JSON.

Structure:
[
  {
    "prompt_number": 1,
    "visual_message": "Brief description of what message/emotion this image conveys",
    "image_prompt": "Detailed image generation prompt describing the cartoon scene, character actions, expressions, environment, colors, mood, and visual storytelling elements. Emphasize: cute cartoon style, expressive faces, clear body language, vibrant colors, and engaging composition. NO TEXT SHOULD APPEAR IN THE IMAGE.",
    "color_palette": "Main colors used (e.g., warm pastels, vibrant neon, cool blues)",
    "scene_type": "Type of scene (e.g., office humor, work-life balance, boss-employee dynamic)",
    "emotion_conveyed": "The primary emotion/message shown through visuals"
  },
  // ... 4 more objects
]

VISUAL STORYTELLING TECHNIQUES TO USE:
- Exaggerated facial expressions (big eyes, dramatic reactions)
- Body language and posture that tells the story
- Environmental context (office settings, clock showing time, etc.)
- Visual metaphors (heavy backpack = burden, rainbow = hope)
- Before/after scenarios shown in single frame
- Relatable workplace situations shown through actions
- Cute animal characters or chibi-style humans
- Props and objects that support the narrative

Now generate 5 prompts for the topic: [TOPIC]`

export const PROMPT_FOR_QUALITY_ADD_ON = `

CRITICAL VISUAL & DESIGN RULES:
- NO TEXT ALLOWED - zero words, letters, or written content
- Use CUTE CARTOON ART STYLE (Disney/Pixar-inspired, chibi, or kawaii aesthetic)
- Characters must have LARGE EXPRESSIVE EYES and exaggerated emotions
- Use VIBRANT, SATURATED colors that pop on screen
- Include VISUAL SYMBOLS: 💼 briefcase, ⏰ clock, 💻 computer, ☕ coffee (as illustrated objects)
- Character actions should be CLEAR and EASY TO UNDERSTAND at a glance
- Use DYNAMIC POSES and animated-style movement lines
- Background should SUPPORT the story (office, home, outdoors) but stay clean
- Apply soft GRADIENT BACKGROUNDS or simple environmental settings
- Characters should be ADORABLE and instantly loveable
- Use RULE OF THIRDS for composition
- Include subtle LIGHTING effects (rim lighting, glow, shadows for depth)
- Keep scenes UNCLUTTERED - focus on 1-2 main characters max
- Emotion should be SO CLEAR that anyone can understand without explanation
- Professional illustration quality with smooth, polished rendering`