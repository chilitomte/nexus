export const partyContent = {
  title: "Hooray!",
  intro: `The humans have re-discovered the techniques of mind travel and are coming back to visit the Visionary Realm, a psychedelic place beyond time and space!

The silly humans suffer. The silly humans have forgotten their deepest selves. They dwell in their serious darkness and disconnection. We want to invite all of you, mysterious entities, to fill our realm, to frolic, to play and to dance. 
Together, we will show the humans the ways of love, bliss and unity.

Who are we? We are the entities, those who live within all and beyond the manifest realm. We are life itself in its most beautiful and extravagant expression, sprung directly from the deepest Source.

Come join us in the Visionary Realm! We need you to show up as your brightest most colorful self to remind the humans of their divine spark, of our infinite playfulness!`,
  highlights: [
    { label: "Decoration", value: "Do you wanna help decorate?" },
    { label: "Vibe", value: "Psychedelic temple meets alien greenhouse" },
    { label: "Bring", value: "Layers, glow, and a playful avatar" },
  ],
  infoCards: [
    {
      title: "Where?",
      description:
        "Södra Förstadsgatan 24, call Miradora on the intercom",
    },
    {
      title: "When?",
      description: `Doors open at 19.00
      The opening ceremony starts at 21:00
      Please be here by 21:00, we shut off the intercom when the ceremony begins, don't miss out!`
    },
    {
      title: "Noise",
      description:
        "Be quiet when walking in the stairs and close the doors gently",
    },
    {
      title: "Small entities",
      description:
        "Child and animal free event",
    },
    {
      title: "Life essence",
      description:
        "There will be snacks available throughout the night, but don’t arrive hungry",
    }
  ],
  dreamCards: [
    {
      title: "Decoration",
      description:
        "Do you wanna help decorate?",
    },
    {
      title: "Workshops",
      description:
        "Do you have an exciting workshop you’ve been waiting to share?",
    },
        {
      title: "Performance",
      description:
        "Do you want to put up your life source on display?",
    }
  ]
} as const;

export const galleryManifest = [
  {
    id: "mirror-mage",
    path: "IMG_2843.JPG",
    alt: "Mirror mage silhouette",
    sortOrder: 1,
  },
  {
    id: "elf-ceremony",
    path: "IMG_2845.JPG",
    alt: "Elf ceremony regalia",
    sortOrder: 2,
  },
  {
    id: "fractal-bloom",
    path: "IMG_2846.JPG",
    alt: "Fractal bloom bodysuit",
    sortOrder: 3,
  },
] as const;

export const RSVP_AVATAR_CHOICES = [
  { seed: "opal-elf", label: "Opal elf" },
  { seed: "neon-oracle", label: "Neon oracle" },
  { seed: "prism-shifter", label: "Prism shifter" },
  { seed: "aurora-trickster", label: "Aurora trickster" },
  { seed: "echo-gardener", label: "Echo gardener" },
  { seed: "moss-mystic", label: "Moss mystic" },
] as const;
