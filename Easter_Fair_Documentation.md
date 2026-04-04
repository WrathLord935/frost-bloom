# Easter Fair Experience - Complete Project Documentation

## Project Overview

**Project Name:** Easter Fair  
**Theme:** Easter celebration and rebirth  
**Format:** Interactive web experience with story + 3 mini-games  
**Target:** College Easter competition (friendly, best project featured on college website)  
**Timeline:** 24-hour sprint  
**Framework:** Nuxt 3 (Vue 3 + Nuxt)  

---

## Story & Narrative

### Core Premise
It's Easter Fair season. Jack Frost (winter) usually ruins Easter celebrations, but this year he's helping. The player's village is competing against a nearby village in a series of games. Jack is on the player's team, trying to prove he belongs in Easter society. Through the games, Jack proves himself and is accepted as part of the community.

### Thematic Message
Easter = Rebirth. Jack Frost's redemption arc represents:
- **Spring rebirth** (winter melting, spring arriving)
- **Personal rebirth** (Jack accepted into society)
- **Metaphorical rebirth** (people can be reborn through acceptance and community)

### Visual Metaphor
The landing page shows **winter → spring transformation** via scrolling and mouse hover. This visual progression mirrors Jack's personal transformation throughout the experience.

---

## User Experience Flow

### 1. Landing Page
**Duration:** ~5-10 seconds (or user-controlled)

**Visual:**
- Two images of the same village landscape
- Image 1 (top): Gloomy, cloudy, winter village on hilly terrain (green but dull, January/February aesthetic)
- Image 2 (bottom): Same village in spring with flowers blooming, sun out, vibrant colors

**Mechanics:**
- **Scrolling:** Automatically transitions from winter → spring as user scrolls
- **Mouse hover:** Dragging mouse over winter image reveals spring underneath (curtain/mask reveal effect)
- Both mechanics work simultaneously

**Aesthetic:**
- Smooth transitions
- No text or UI (let visuals speak)
- Responsive to both scroll and mouse movement

**Next:** Click to proceed to story intro OR auto-advance after 10 seconds

---

### 2. Story Introduction
**Duration:** ~30-45 seconds

**Scene:** Easter Fair setting with village, bunnies, Jack Frost visible

**Text/Dialogue:**
"Welcome to the Easter Fair! Our village is competing against the nearby village to prove Easter belongs here. Jack Frost usually ruins Easter, but this year he's helping us. Help Jack win these games and prove he belongs in our community."

**Visual Elements:**
- Village in spring (from landing reveal)
- Bunnies visible (cheerful)
- Jack Frost visible (friendly, not menacing)
- Spring/Easter decorations

**Next:** First game begins

---

### 3-5. Three Games (Competition Format)

**Overall Structure:**
- Player represents their village
- Nearby village is the opponent
- Jack Frost plays on the player's team
- Each game won = point for the village
- Visual feedback shows current score

**Between Games:**
- Brief transition
- Score update
- Spring visuals progress slightly (becomes more vibrant/bloomed as games are won)

#### **Game 1: Hangman (Easter Words)**

**Duration:** 3-5 minutes per round

**Objective:** Guess the hidden Easter-themed word before hangman is complete

**Mechanics:**
- Word is hidden (dashes showing letter count)
- Player guesses letters by clicking letter buttons (A-Z)
- Correct guess: Letter reveals in word
- Wrong guess: Add one part to hangman figure (max 6 wrong = lose)
- Win: Complete word before hangman is complete
- Lose: Hangman finished before word complete

**Word List (Easter-themed):**
- BUNNY
- SPRING
- BLOOM
- REBIRTH
- CHOCOLATE
- BASKET
- EGGS
- RESURRECTION
- RENEWAL
- CELEBRATION
- FLOWERS
- HOPEFUL

**Visual Feedback:**
- Letter buttons light up when clicked
- Correct letters appear in word
- Wrong guesses show hangman progression
- Win/lose screen with score impact

**Difficulty:** Medium (words are thematic, some 6+ letters)

**Scoring:**
- Win: +1 point for player's village
- Lose: +1 point for opponent village

---

#### **Game 2: Easter Hunt (Find Hidden Eggs)**

**Duration:** 30-45 seconds per round

**Objective:** Find and click on 5 hidden Easter eggs in the image before time runs out

**Mechanics:**
- Static image of Easter fair/village scene
- 5 Easter eggs hidden throughout (mix of easy/medium difficulty)
- Player clicks on eggs to collect them
- Each egg collected = visual feedback + counter increases
- Timer counts down (30-45 seconds)
- Win: Find all 5 eggs before timer ends
- Lose: Timer runs out before finding all 5

**Image Requirements:**
- Detailed Easter Fair scene (village, bunnies, spring decorations)
- Eggs hidden naturally (in bushes, baskets, flowers, etc.)
- Easy eggs: Obvious placements
- Medium eggs: Require closer looking but fair

**Visual Feedback (Egg Collection):**
- When egg is clicked: Egg zooms to center of screen + fades away
- Counter updates: "Eggs found: 2/5"
- Success animation if all found before time
- Fail animation if time runs out

**Scoring:**
- Win (all 5 found): +1 point
- Lose (fewer than 5): +0 points

---

#### **Game 3: Ice Egg Game (Unique - Melt Ice Blocks)**

**Duration:** 20 seconds per round

**Objective:** Click ice blocks to melt them and free the Easter eggs inside. Avoid clicking bomb eggs. Survive with at least 1 health.

**Mechanics:**
- Ice blocks appear on screen continuously for 20 seconds
- Each ice block contains either:
  - **Good egg** (normal Easter egg)
  - **Bomb egg** (1 out of every 4 blocks, approximately)
- Player clicks ice blocks to melt them
- **Click good egg:** +1 score, egg freed, visual feedback
- **Click bomb egg:** -1 health, explosion animation
- **Player starts with 3 health**
- Win condition: Time runs out AND player has ≥1 health remaining
- Lose condition: Player loses all 3 health before timer ends

**Mechanics Details:**
- Ice blocks spawn randomly on screen
- Player can't see what's inside until clicked
- Melting animation plays when clicked (ice cracks/shatters)
- Blocks continue spawning until 20-second timer ends
- No difficulty scaling (same throughout)

**Visual Feedback:**
- **Good egg click:** Egg revealed, zooms up, happy sound, +1 score
- **Bomb click:** Explosion animation, -1 health lost, "boom" sound
- **Health display:** 3 hearts/health bar visible
- **Timer:** Countdown visible
- **Score:** Eggs freed count visible

**Scoring:**
- Win (timer ends + ≥1 health): +1 point
- Lose (lost all 3 health): +0 points

---

### 6. Results & Ending

**Duration:** 30-60 seconds

**Screen 1: Final Score**
- Display final scores: Player's village vs. Opponent village
- Indicate winner: "Your village wins!" or "The other village wins" or "It's a tie!"

**Screen 2: Jack's Acceptance**
- Scene shows Jack Frost with bunnies and villagers
- Text: "Jack has been accepted into Easter! He's now part of our community."
- Visual: Spring is fully bloomed, Jack is smiling, village is celebrating
- Optional: Jack waves or does a celebration animation

**Screen 3: Final Message**
"Easter is about rebirth—the rebirth of spring, the rebirth of hope, and the rebirth of people into community. Jack Frost has found his place among us."

**Aesthetic:**
- Warm, celebratory
- Full spring/Easter colors
- Joyful music/sound effects
- Perhaps confetti or particle effects

**Optional:** Credits roll with player's name/village name if they entered one

---

## Visual Design

### Landing Page
- **Winter image:** Gloomy, cloudy, muted greens, hillside village
- **Spring image:** Bright, sunny, vibrant flowers, lush greens, same village composition
- **Transition:** Smooth, seamless
- **Hover reveal:** Smooth mask following cursor

### Game Screens
- **Background:** Consistent Easter Fair aesthetic (spring village)
- **Jack Frost:** Friendly character visible (not menacing, blue/white color palette)
- **Bunnies:** Cheerful, visible in background or as UI elements
- **Colors:** Vibrant spring palette (pastels + bright accents)
- **Typography:** Readable, Easter-themed if possible (rounded fonts, playful)

### Overall Aesthetic Direction
- **Tone:** Cheerful, light, celebratory (NOT dark or gloomy)
- **Color palette:** Spring colors (soft greens, pastels, bright accents)
- **Visual progression:** Darker/muted → brighter/vibrant as games progress
- **Design philosophy:** Clean, readable, engaging but not overwhelming

---

## Technical Specifications

### Framework
**Nuxt 3** (Vue 3 + Nuxt ecosystem)

### Key Features Required
1. **Landing Page:**
   - Scrollable transition between two images
   - Mouse hover reveal (clip-path or canvas masking)
   - Smooth animations

2. **Game Container:**
   - Scoreboard (villages + scores)
   - Game state management
   - Timer system
   - Health/lives system (for game 3)

3. **Game 1 - Hangman:**
   - Word randomization
   - Letter button toggle system
   - Hangman figure drawing (SVG or canvas)
   - Win/lose detection

4. **Game 2 - Easter Hunt:**
   - Image with clickable regions
   - Click detection on egg locations
   - Counter tracking (5 eggs)
   - Timer countdown
   - Visual feedback (zoom + fade animation)

5. **Game 3 - Ice Egg:**
   - Random ice block spawning
   - Health tracking
   - Bomb vs. egg detection
   - Collision/click detection
   - Visual feedback (melt, explosion animations)

6. **Results Screen:**
   - Score comparison
   - Winner determination
   - Celebration scene/message

### Libraries & Tools
- **Nuxt 3:** Core framework (Vue 3)
- **Tailwind CSS:** Styling
- **Framer Motion / Vue Motion:** Animations
- **Canvas API or SVG:** For complex visuals (hangman figure, ice blocks)
- **Gsap:** High-performance animations
- **Vite:** Build tool (included with Nuxt 3)

### Asset Requirements
- **Images:** Winter village image, spring village image (high quality)
- **Game 2 image:** Easter Hunt scene with hidden eggs
- **Sprites/Icons:** Easter eggs, bombs, hearts (health), etc.
- **Audio:** Optional (win/lose sounds, background music)
- **Fonts:** Easter-themed font (or standard readable font)

### State Management
- Nuxt composables (Vue 3 Composition API)
- Game state: current game, scores, player health, timer
- Story state: which screen/game player is on

### Responsive Design
- Mobile-friendly
- Touch support for games
- Desktop-friendly with mouse
- Tablet responsive

---

## Build Timeline (24-Hour Sprint)

### Hour 1-2: Setup & Planning
- [x] Project structure created
- [x] Nuxt 3 initialized
- [x] Tailwind CSS configured
- [x] Asset gathering (images, icons)
- [x] Component hierarchy planned

### Hour 3-4: Landing Page
- [ ] Landing page layout created
- [ ] Two images integrated (winter + spring)
- [ ] Scrolling transition implemented
- [ ] Mouse hover reveal mechanic built (clip-path + cursor tracking)
- [ ] Animations smooth and responsive

### Hour 5-6: Story Intro & UI Framework
- [ ] Story intro screen created
- [ ] Scoreboard component built (village names, scores)
- [ ] Game container layout
- [ ] Navigation between screens (landing → story → games → results)
- [ ] State management setup

### Hour 7-10: Game 1 - Hangman
- [ ] Hangman game component
- [ ] Word list + randomization
- [ ] Letter button system (A-Z)
- [ ] Hangman figure drawing (SVG)
- [ ] Win/lose logic
- [ ] Visual feedback + animations
- [ ] Scoring integration

### Hour 11-13: Game 2 - Easter Hunt
- [ ] Game 2 component
- [ ] Image integrated with clickable regions
- [ ] Click detection for eggs
- [ ] Counter system (eggs found)
- [ ] Timer countdown
- [ ] Zoom + fade animation for collected eggs
- [ ] Win/lose logic
- [ ] Scoring integration

### Hour 14-17: Game 3 - Ice Egg
- [ ] Game 3 component
- [ ] Ice block spawning system (continuous)
- [ ] Bomb vs. good egg detection
- [ ] Click/collision detection
- [ ] Health system (3 hearts)
- [ ] Melt animation (good eggs)
- [ ] Explosion animation (bombs)
- [ ] Win/lose logic
- [ ] Scoring integration

### Hour 18-20: Results & Ending
- [ ] Results screen (score comparison)
- [ ] Winner determination logic
- [ ] Jack's acceptance scene
- [ ] Final message screen
- [ ] Celebration visuals/animations

### Hour 21-23: Polish & Testing
- [ ] Visual refinement (colors, spacing, typography)
- [ ] Animation smoothness
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Game balance (timing, difficulty, fairness)
- [ ] Bug fixes
- [ ] Audio (if adding)

### Hour 24: Final Review & Deploy
- [ ] Full playthrough test
- [ ] Performance optimization
- [ ] Browser compatibility check
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Final polish

---

## Component Structure (Nuxt)

```
pages/
├── index.vue (landing page)
├── story.vue (intro)
├── game.vue (game container)
└── results.vue (final screen)

components/
├── LandingPage.vue
├── StoryIntro.vue
├── Scoreboard.vue
├── Game1Hangman.vue
├── Game2EasterHunt.vue
├── Game3IceEgg.vue
├── ResultsScreen.vue
└── JackAcceptance.vue

composables/
├── useGameState.js (global game state)
├── useTimer.js (timer logic)
└── useScore.js (scoring system)

assets/
├── images/
│── ├── village-winter.jpg
│── ├── village-spring.jpg
│── ├── easter-hunt-scene.jpg
│── └── ...
├── icons/
│── ├── egg.svg
│── ├── bomb.svg
│── ├── heart.svg
│── └── ...
└── audio/
    ├── bg-music.mp3
    └── sfx-*.mp3
```

---

## Game Balance & Design Decisions

### Hangman
- **Difficulty:** Medium (12 words, 6-10 letters average)
- **Guesses allowed:** 6 wrong guesses before loss
- **Time:** Unlimited (player-paced)
- **Fairness:** All words are Easter-themed and recognizable

### Easter Hunt
- **Eggs to find:** 5
- **Time limit:** 45 seconds (adjustable based on image complexity)
- **Difficulty mix:** 2 easy + 2 medium + 1 hard egg placements
- **Fairness:** Eggs are hidden naturally, not obscured unfairly

### Ice Egg
- **Duration:** 20 seconds (fixed, fast-paced)
- **Health:** 3 (enough for ~3 mistakes)
- **Bomb ratio:** ~1 bomb per 4 blocks (~25% bomb rate)
- **Difficulty:** Consistent (no scaling, tests reflexes equally)
- **Fairness:** Bombs are random but fair; no hidden bombs

### Overall Scoring
- Best of 3 (each game = 1 point)
- Win = +1 point, Lose = +0 points
- Possible outcomes: 3-0 (sweep), 2-1, 1-2, 0-3
- Tie possible if both villages win different games

---

## Accessibility & Inclusivity

### Considerations
- **Colorblind:** Don't rely solely on red/green (bomb vs. egg)
- **Motor accessibility:** Games should work with keyboard + mouse
- **Text contrast:** Ensure readable contrast ratios
- **Audio:** Don't rely solely on sound for game feedback
- **Touch:** Mobile-friendly touch targets for game interactions

### Implementation
- Keyboard support: Tab to navigate buttons, Enter/Space to activate
- Icons + text labels (not just colors)
- Haptic feedback (vibration) on mobile for game events
- Screen reader friendly HTML structure

---

## Optional Enhancements (If Time Permits)

1. **Player Name Input:** Intro screen asks for village name (displayed in scoreboard)
2. **Sound Design:** Background music + game SFX
3. **Difficulty Levels:** Easy/Medium/Hard mode selection
4. **Leaderboard:** Track best scores (localStorage)
5. **Animation Polish:** Particle effects, more sophisticated transitions
6. **Multiple Rounds:** Play 3 games, then option to play again
7. **Custom Story:** Personalized ending based on player's village name
8. **Jack Frost Animation:** Animated character that reacts to wins/losses
9. **Share Feature:** Share final score on social media (optional)
10. **Accessibility:** Full WCAG 2.1 AA compliance

---

## Deployment

### Hosting Options
1. **Vercel** (recommended for Nuxt)
   - Free tier, easy setup
   - Deploy from GitHub
   - Built-in analytics

2. **Netlify**
   - Free tier
   - Simple deployment

3. **Render / Railway**
   - Free tier, good for backend

### Build & Deploy Command
```bash
npm run build
npm run generate  # Static generation
# Deploy dist/ folder to hosting
```

---

## Success Criteria

### Functional
- [x] Landing page scrolling + hover reveal works smoothly
- [x] All 3 games are playable and winnable
- [x] Scoring system works correctly
- [x] Story progression is clear
- [x] Results screen displays winner correctly

### Visual
- [x] Consistent Easter/spring aesthetic
- [x] Jack Frost appears friendly (not menacing)
- [x] Animations are smooth (60fps)
- [x] Responsive design works on mobile/tablet/desktop
- [x] Colors are vibrant and thematic

### Thematic
- [x] Story about Jack's acceptance is clear
- [x] Easter rebirth theme is evident
- [x] Light, cheerful tone maintained
- [x] No dark or unsettling elements

### Technical
- [x] No console errors
- [x] Fast load time (<3 seconds)
- [x] No memory leaks
- [x] All assets optimized

---

## Final Notes

### Key Decisions Made
1. **Story-driven experience** (not just games)
2. **Jack Frost as protagonist** (represents acceptance/rebirth)
3. **Visual metaphor** (winter → spring reflects Jack's transformation)
4. **3 different game types** (variety keeps engagement)
5. **Competition format** (stakes for player engagement)
6. **Cheerful, light tone** (no religious or dark themes)

### Differentiation from Friend's Project
- Friend's project: **Game-heavy** (Undertale UI + Pac-Man mechanics)
- Your project: **Story + Thematic depth** (narrative-driven experience)
- Your project focuses on **Easter meaning** (rebirth, acceptance) while friend focuses on **gameplay mechanics**

### Why This Will Stand Out
- Thematically tight (every element serves the Easter rebirth message)
- Visually cohesive (winter → spring visual progression)
- Emotionally resonant (Jack's acceptance arc)
- Different from typical game competitions (story-first approach)
- Innovative landing page mechanic (hover reveal is striking)

---

## Contact & Questions

If any clarifications are needed during development:
- Review this document first
- Adjust timeline if needed
- Prioritize: Landing page → Games → Story → Polish

Good luck with the 24-hour sprint! 🐰🌸

