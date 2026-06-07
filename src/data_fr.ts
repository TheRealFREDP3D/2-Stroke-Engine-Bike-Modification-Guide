import { Hotspot, QuizQuestion, Achievement, EngineStage, AssemblyStep, VideoGuide } from "./types";

export const MOTORS_HOTSPOTS_FR: Hotspot[] = [
  {
    id: "brakes",
    name: "Freins Avant & Arrière",
    title: "Puissance d'Arrêt Sous Charge du Moteur",
    description: "Votre vélo tout-terrain a été conçu pour des vitesses à propulsion humaine. L'ajout d'un moteur thermique exige une puissance de freinage extrêmement fiable. Les freins à rétropédalage intégrés au moyeu sont très dangereux sur un vélo motorisé : si la chaîne de transmission se détend ou saute, vous perdez instantanément tout moyen de freiner !",
    safetyProtocol: "Vérifiez impérativement que votre vélo dispose de freins à main indépendants à l'avant et à l'arrière (les freins à disque sont idéaux, les étriers V-Brake de qualité sont également très efficaces). Ne négligez JAMAIS le frein avant — il assure à lui seul près de 70 % de votre décélération !",
    mechanicNote: "L'énergie cinétique augmente de manière exponentielle avec la vitesse (Ec = 1/2 * m * v²). Si vous triplez votre vitesse, votre distance de freinage est multipliée par 9 ! Gardez vos patins et disques impeccables.",
    coords: { x: 12, y: 38 },
    importance: "CRITICAL"
  },
  {
    id: "sprocket",
    name: "Couronne de Transmission Arrière",
    title: "Interface de fixation à bride (Rag Joint)",
    description: "Le moteur utilise une chaîne de transmission secondaire directement connectée à une couronne d'entraînement fixée sur les rayons de la roue arrière. Si cette couronne est installée de travers, voilée ou décentrée de plus d'un millimètre, la chaîne sautera sous tension ou détruira instantanément vos rayons.",
    safetyProtocol: "Serrez les 9 boulons de la bride en caoutchouc (rag joint) pas à pas, en suivant rigoureusement un ordre en étoile opposé. Soulevez le vélo et faites tourner la roue : assurez-vous que la couronne tourne de manière parfaitement concentrique, sans aucun voile.",
    mechanicNote: "Excentricité de rotation : Si la couronne tourne de manière décentrée, la chaîne subit d'importantes variations de tension à chaque tour, créant des chocs brutaux capables de briser les maillons.",
    coords: { x: 84, y: 72 },
    importance: "CRITICAL"
  },
  {
    id: "engine_mount",
    name: "Support de Cadre en V",
    title: "Serrage de Sécurité du Bloc Moteur",
    description: "Le bloc moteur se loge précisément au centre du triangle de votre cadre. Les diamètres de tubes variant d'un vélo à l'autre, les brides de fixation standards fournies dans les kits ne s'adaptent pas toujours directement. AVERTISSEMENT : Ne percez sous aucun prétexte un trou à travers les tubes de votre cadre pour y insérer une vis de fixation !",
    safetyProtocol: "Intercalez des bandes de caoutchouc denses entre la bride métallique et le cadre pour protéger les tubes et amortir les vibrations à haute fréquence. Bloquez le support avec des rondelles élastiques de sécurité ou des contre-écrous.",
    mechanicNote: "Concentration de contraintes : Percer un trou dans un tube en acier ou en aluminium crée un point de fragilité extrême. Avec les vibrations mécaniques du moteur, le tube se fissurera rapidement jusqu'à la rupture complète.",
    coords: { x: 48, y: 55 },
    importance: "HIGH"
  },
  {
    id: "chain_tensioner",
    name: "Galet Tendeur de Chaîne",
    title: "Sécurité et Alignement du Tendeur",
    description: "Pour relier le pignon de sortie du moteur à la couronne arrière, la longue chaîne renforcée (#415) nécessite d'être guidée par un galet tendeur monté sur le bras oscillant. Si les colliers de fixation de ce tendeur se desserrent, le bloc entier pivotera brusquement dans vos rayons en pleine vitesse, provoquant un blocage de roue immédiat !",
    safetyProtocol: "Fixez le galet de manière ultra-rigide. Il est fortement recommandé d'ajouter un boulon d'arrêt traversant à travers le bras de force ou un collier de serrage renforcé pour empêcher toute rotation fortuite vers la roue.",
    mechanicNote: "Flèche et vibration de chaîne : La tension idéale permet un débattement vertical d'exactement 1,2 cm (1/2 pouce). Une chaîne trop tendue force sur le vilebrequin; trop lâche, elle déraille et s'enroule.",
    coords: { x: 68, y: 74 },
    importance: "CRITICAL"
  },
  {
    id: "fuel_tank",
    name: "Réservoir d'Essence de Tube Supérieur",
    title: "Acheminement de Carburant par Gravité",
    description: "Les réservoirs de carburant de vélo motorisé fonctionnent par simple gravité, sans aucune pompe mécanique. L'essence s'écoule naturellement vers le bas, passant à travers un robinet d'arrêt (petcock) et un filtre avant d'arriver dans la cuve du carburateur.",
    safetyProtocol: "Acheminez les durites de carburant avec une pente descendante douce et continue. Ne les laissez jamais entrer en contact avec les ailettes chaudes du cylindre ! Installez un filtre transparent pour intercepter les débris instantly.",
    mechanicNote: "Alimentation par gravité et bouchon de vapeur : Si la durite remonte à un endroit, une bulle d'air peut s'y bloquer (bouchon de vapeur), stoppant net l'écoulement. Attention, l'essence ordinaire dégrade le caoutchouc standard; utilisez des durites en polyuréthane approuvées !",
    coords: { x: 45, y: 30 },
    importance: "CRITICAL"
  },
  {
    id: "kill_switch",
    name: "Interrupteur de Coupe-Circuit d'Urgence",
    title: "Coupe-Circuit d'Allumage à la Masse",
    description: "Si le câble d'accélérateur mécanique ou le boisseau du carburateur reste bloqué en position d'ouverture maximale en roulant, freiner ne suffira pas. Vous devez couper instantanément l'étincelle d'allumage pour éteindre le moteur.",
    safetyProtocol: "Enveloppez soigneusement tous les raccords de câblage dans de la gaine thermorétractable pour éviter les courts-circuits accidentels sous la pluie. Montez impérativement le bouton rouge à portée immédiate de votre pouce gauche !",
    mechanicNote: "Circuit d'allumage : Le boîtier CDI génère une impulsion de près de 15 000 volts. L'interrupteur fonctionne en redirigeant cette tension directement vers le guidon en métal (mise à la terre), privant ainsi la bougie d'allumage d'étincelle.",
    coords: { x: 28, y: 24 },
    importance: "CRITICAL"
  }
];

export const ENGINE_STAGES_FR: EngineStage[] = [
  {
    id: "intake",
    name: "Admission & Compression",
    description: "En pédalant pour démarrer le vélo puis en relâchant l'embrayage, le piston est entraîné vers le haut du cylindre. Dans sa montée, il comprime fortement le mélange air-essence-huile au-dessus de lui à environ 1/6e de son volume initial pour maximiser la force de déflagration. Simultanément, ce mouvement ascendant crée un vide sous le piston, aspirant une charge fraîche de carburant vaporisé depuis le carburateur vers le bas du carter étanche.",
    physicsNotion: "Loi de Boyle-Mariotte & Vide : Comprimer un gaz augmente sa température et son potentiel énergétique. La dépression interne créée dans le carter moteur fonctionne comme le piston d'une seringue médicale.",
    ventStatus: "Transfert d'Admission OUVERT, Échappement FERMÉ",
    pistonPosition: "up",
    color: "#3b82f6"
  },
  {
    id: "power",
    name: "Allumage & Détente (Explosion)",
    description: "Au moment précis où le piston atteint son point culminant (Point Mort Haut), le boîtier CDI envoie une décharge de 15 000 volts à la bougie d'allumage. Une étincelle électrique bleu vif jaillit et enflamme le mélange comprimé. Les gaz s'embrasent instantanément et se dilatent violemment. Cette formidable poussée thermique repousse le piston vers le bas avec un couple massif, entraînant le vilebrequin qui fait tourner votre chaîne !",
    physicsNotion: "Thermodynamique & Transfert d'Énergie : La combustion chimique transforme l'énergie du carburant en énergie thermique. Cette pression se convertit immédiatement en Force Rectiligne (Force = Pression × Surface du Piston).",
    ventStatus: "Tous les transferts FERMÉS (Force de Poussée Pure)",
    pistonPosition: "down",
    color: "#ef4444"
  },
  {
    id: "exhaust",
    name: "Échappement & Balayage",
    description: "Lorsque le piston redescend, il découvre la lumière d'échappement pratiquement au bas de sa course. Les gaz brûlés s'échappent alors à haute pression vers le pot d'échappement. Juste après, le transfert d'admission s'ouvre : le mélange frais préalablement comprimé sous le piston s'engouffre dans le haut du cylindre, chassant les derniers résidus de fumée (phénomène de balayage). Le piston remonte, entamant un nouveau cycle !",
    physicsNotion: "Dynamique des Fluides : La vitesse d'expulsion des gaz brûlés crée une dépression naturelle derrière elle. Ce vide partiel aide à aspirer la charge de carburant frais depuis le carter inférieur pour une efficacité maximale.",
    ventStatus: "Lumière d'Échappement OUVERTE, Lumière d'Admission OUVERTE",
    pistonPosition: "down",
    color: "#10b981"
  }
];

export const SAFETY_QUIZ_FR: QuizQuestion[] = [
  {
    id: "q1",
    question: "Pourquoi est-il absolument obligatoire de mélanger de l'huile spéciale 2-temps directement dans l'essence ?",
    options: [
      "L'huile colore l'essence en bleu pour indiquer qu'elle est hautement inflammable.",
      "Ces moteurs n'ont pas de carter d'huile, de pompe ou de filtre à huile ! Sans huile mélangée à l'essence, les pièces métalliques frotteront à sec et le moteur serrera (fondra) en moins de 5 minutes.",
      "L'huile empêche la chaîne de transmission de sauter de la couronne arrière.",
      "Cela donne aux gaz d'échappement une agréable odeur de fraise."
    ],
    correctIndex: 1,
    explanation: "Excellent ! Contrairement à une voiture, un moteur 2 temps de vélo dépend de l'huile dissoute dans l'essence pour lubrifier les segments du piston et les roulements du vilebrequin. Sans huile, le moteur est irrémédiablement détruit !",
    category: "Fuel & Torque"
  },
  {
    id: "q2",
    question: "Pourquoi vous interdit-on rigoureusement de percer un trou à travers le cadre de votre vélo pour fixer le moteur ?",
    options: [
      "Cela ferait rouiller le métal beaucoup trop vite.",
      "Cela annulerait la garantie d'origine de votre pneu arrière.",
      "Percer un tube affaiblit la structure et crée des concentrations de contraintes. Avec les vibrations constantes du moteur, le métal finira par se briser net pendant que vous roulez !",
      "Cela élèverait trop le centre de gravité."
    ],
    correctIndex: 2,
    explanation: "Exactement ! Percer le tube d'un vélo détruit son intégrité mécanique. Utilisez toujours des colliers de fixation externes associés à des cales en caoutchouc de protection.",
    category: "Mechanics"
  },
  {
    id: "q3",
    question: "Si votre pignon de sortie moteur compte 10 dents et votre couronne de roue arrière 44 dents, de quel avantage mécanique disposez-vous ?",
    options: [
      "Une augmentation de vitesse de 4.4 : 1 (votre roue tourne 4,4 fois plus vite que le vilebrequin).",
      "Un rapport de réduction mécanique de 4.4 : 1. Le moteur doit tourner 4,4 fois pour faire faire un tour à la roue arrière, convertissant la vitesse en un couple puissant pour gravir les côtes.",
      "Une liaison directe 1:1 maintenant la puissance et la vitesse parfaitement équivalentes.",
      "Les engrenages se bloquent, vous obligeant à rouler uniquement en marche arrière."
    ],
    correctIndex: 1,
    explanation: "Oui ! 44 dents divisées par 10 dents donne un rapport de réduction de 4,4. En réduisant les tours par minute, on démultiplie le couple, ce qui permet à un petit moteur de propulser un pilote en côte.",
    category: "Fuel & Torque"
  },
  {
    id: "q4",
    question: "Que devez-vous faire si votre câble d'accélérateur se bloque en position grande ouverte pendant que vous roulez ?",
    options: [
      "Pédaler en arrière le plus vite possible pour tenter de bloquer la transmission.",
      "Serrer fermement les freins et appuyer immédiatement sur le bouton coupe-circuit rouge pour éteindre l'allumage.",
      "Lâcher le guidon et sauter du vélo immédiatement à pleine vitesse.",
      "Vous pencher en avant pour souffler fort dans le filtre à air du carburateur."
    ],
    correctIndex: 1,
    explanation: "Parfait ! Les freins vous ralentiront, mais appuyer sur le coupe-circuit (Kill Switch) met instantanément la bobine CDI à la terre, coupant l'étincelle de la bougie pour stopper le moteur de manière sécurisée.",
    category: "Safety"
  },
  {
    id: "q5",
    question: "De quelle manière devez-vous serrer les 9 vis de fixation de la couronne d'entraînement arrière sur vos rayons ?",
    options: [
      "Serrer chaque boulon l'un après l'autre, dans le sens des aiguilles d'une montre de manière circulaire.",
      "Utiliser un ordre croisé (motif en étoile), en serrant progressivement chaque vis pour garantir que la couronne soit parfaitement plane et centrée.",
      "Serrer uniquement à la main pour éviter de tordre les rayons du vélo.",
      "Coller directement la couronne avec de la colle forte de chantier et supprimer les vis."
    ],
    correctIndex: 1,
    explanation: "Bravo ! Le serrage en étoile répartit uniformément la contrainte. Si vous serrez un côté d'un bloc, la couronne s'installera de travers, générant un voile de chaîne catastrophique et un déraillement immédiat.",
    category: "First Ride"
  }
];

export const WORKSHOP_ACHIEVEMENTS_FR: Achievement[] = [
  {
    id: "badge_inspect",
    title: "Inspecteur de Sécurité",
    description: "Inspecté l'ensemble des 6 points de contrôle sur le schéma interactif du vélo.",
    icon: "ClipboardCheck",
    status: "locked"
  },
  {
    id: "badge_engine",
    title: "Explorateur Thermodynamique",
    description: "Parcouru avec succès les 3 cycles de combustion du simulateur de moteur 2 temps.",
    icon: "Flame",
    status: "locked"
  },
  {
    id: "badge_quiz",
    title: "Mécanicien Certifié",
    description: "Validé le questionnaire de sécurité de l'atelier avec un score parfait !",
    icon: "ShieldAlert",
    status: "locked"
  },
  {
    id: "badge_checklist",
    title: "Maître Assembleur",
    description: "Coché l'intégralité des 15 étapes de montage dans le carnet d'atelier.",
    icon: "Wrench",
    status: "locked"
  },
  {
    id: "badge_video",
    title: "Apprenti du Cinéma",
    description: "Visionné les modules vidéos éducatifs et validé les clés de sécurité.",
    icon: "Tv",
    status: "locked"
  }
];

export const VIDEO_GUIDES_FR: VideoGuide[] = [
  {
    id: "v_sprocket",
    title: "Alignement de Couronne & Serrage de la Bride",
    description: "Apprenez à fixer la couronne de transmission secondaire sur les rayons de la roue arrière. Un mauvais montage entraîne des déraillements, des rayons brisés ou des blocages dangereux. Découvrez la règle d'or du centrage.",
    youtubeUrl: "https://www.youtube.com/embed/8nMsIB8SeDc",
    thumbnailUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=640",
    duration: "4:15",
    category: "Drive Train Setup",
    safetyPrecaution: "Ne travaillez jamais sur la roue arrière lorsque la chaîne moteur est sous tension. Serrez impérativement les boulons en étoile pour ne pas tordre vos rayons ou voiler la couronne.",
    mechanicConcept: "Concentricité et Tolérance : La force centrifuge projettera rapidement hors de son axe une couronne mal centrée. Maintenir un faux-rond inférieur à 1mm est indispensable.",
    chapters: [
      { time: "0:00", title: "Introduction et Outillage", description: "Vérification du kit à 9 boulons, bagues élastomères et clés plates." },
      { time: "1:10", title: "Montage Concentrique", description: "Centrage minutieux par rapport à l'axe de la roue arrière. Prenez vos mesures !" },
      { time: "2:30", title: "Serrage Croisé Progressive", description: "Serrage en étoile des vis de fixation pour équilibrer la tension des rayons." },
      { time: "3:45", title: "Contrôle Dynamique du Voile", description: "Faire tourner la roue dans le cadre pour contrôler visuellement le voile avant blocage final." }
    ]
  },
  {
    id: "v_engine",
    title: "Fixation du Bloc : Centrage & Amortissement",
    description: "La rigidité de la fixation du bloc moteur au cadre est primordiale pour lutter contre les contraintes vibratoires. Nous détaillons le positionnement en V, l'écart thermique et les dangers du perçage de cadre.",
    youtubeUrl: "https://www.youtube.com/embed/TpAhGueJeQQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=640",
    duration: "3:40",
    category: "Engine Assembly",
    safetyPrecaution: "Présence d'un adulte recommandée pour soulever et positionner le moteur. Portez des chaussures de sécurité. Ne percez jamais le cadre.",
    mechanicConcept: "Contraintes Structurelles et Amortissement : Les vibrations à haute fréquence provoquent des ruptures par fatigue sur les métaux percés. L'usage de patins protège le cadre.",
    chapters: [
      { time: "0:00", title: "Ajustement à Sec", description: "Mesure de la garde au sol, du passage de l'échappement et de la position du robinet d'essence." },
      { time: "0:55", title: "Contrôle des Passages de Manivelle", description: "Vérifier que les pédales passent à plus de 5mm des carters moteur." },
      { time: "2:00", title: "Pose des Fourreaux Résilients", description: "Installation de patins en néoprène ou de cales en caoutchouc souple." },
      { time: "3:10", title: "Serrage Progressif des Écrous", description: "Utilisation de rondelles frein et de frein filet bleu sur les goujons." }
    ]
  },
  {
    id: "v_chain",
    title: "Calcul de Longueur de Chaîne & Réglage du Tendeur",
    description: "Installation de la chaîne renforcée #415. Ce guide couvre l'utilisation du dérive-chaîne, l'alignement des maillons et le verrouillage sécurisé du galet tendeur.",
    youtubeUrl: "https://www.youtube.com/embed/0z3f5Mc6WO0",
    thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=640",
    duration: "5:10",
    category: "Drive Train Setup",
    safetyPrecaution: "Si le tendeur pivote dans les rayons, la roue se bloquera instantanément. Utilisez toujours une vis de bridage ou un collier supplémentaire.",
    mechanicConcept: "Fréquence de Résonance et Flèche : Une chaîne trop tendue use prématurément le vilebrequin. Trop lâche, elle bat violemment et peut perforer les carters.",
    chapters: [
      { time: "0:00", title: "Utilisation du Dérive-Chaîne", description: "Extraction propre des axes sans plier les plaques d'assemblage extérieures." },
      { time: "1:25", title: "Fixation de l'Attache-Rapide", description: "Positionner le clip avec sa partie fermée orientée dans le sens de rotation de la chaîne." },
      { time: "3:10", title: "Sécurisation de la Bride", description: "Mise en place de contre-écrous et d'un pion d'ancrage anti-rotation." },
      { time: "4:30", title: "Ajustement de la Tension", description: "Mesure du débattement pour obtenir la flèche cible idéale de 12mm." }
    ]
  },
  {
    id: "v_fuel",
    title: "Dosage Huile-Essence, Alimentation & Câblage CDI",
    description: "Faites de la chimie appliquée ! Apprenez à préparer le mélange 40:1 de rodage, à assurer une pente de durite parfaite et à isoler les connexions de l'allumage.",
    youtubeUrl: "https://www.youtube.com/embed/Thw5SEyzLmg",
    thumbnailUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=640",
    duration: "4:00",
    category: "Fuel Tuning",
    safetyPrecaution: "Préparez votre mélange à l'extérieur. Ne manipulez jamais de carburant à proximité de chauffages ou de sources d'étincelles. Gants de travail requis.",
    mechanicConcept: "Gravité & Isolation Électrique : Le réservoir alimente le moteur par pression hydrostatique. Tout coude prononcé désamorce le circuit d'essence.",
    chapters: [
      { time: "0:00", title: "Calcul du Dosage du Mélange 2T", description: "Calculer les volumes : 16:1 (6.2%) pour le rodage initial, puis 40:1 (2.5%) pour l'usage courant." },
      { time: "1:15", title: "Pose Sécurisée du Réservoir", description: "Pose sur coussinets amortisseurs sur le tube supérieur du cadre. Éviter tout coincement." },
      { time: "2:20", title: "Raccordement des Durites", description: "Montage du filtre à essence transparent. S'assurer de la descente continue du tuyau." },
      { time: "3:30", title: "Câblage Étrangleur & Coupe-Circuit", description: "Sertissage des fiches du coupe-circuit et pose de gaine thermo d'étanchéité." }
    ]
  }
];

export const ASSEMBLY_STEPS_FR: AssemblyStep[] = [
  {
    id: "step1",
    phase: "Preparation",
    title: "Inspection pré-montage du cadre & Outillage",
    description: "Avant de monter de lourdes pièces de fonderie sur votre cadre de vélo standard, nous devons contrôler que le châssis l'est apte à supporter ces nouvelles contraintes.",
    sparkyTip: "Préparez vos outils ! Vous aurez besoin de clés plates (10, 12, 14mm), d'un tournevis, de clés Allen, de chiffons propres et d'un flacon de frein filet bleu (Loctite 242).",
    difficulty: "Easy",
    mechanicConcept: "Santé Structurelle : Vérifiez les soudures du cadre, en particulier vers le boîtier de pédalier. Les vibrations du moteur reveleront vite les moindres faiblesses !",
    subtasks: [
      { id: "s1-1", text: "Nettoyer soigneusement le triangle central du cadre pour éliminer la graisse et permettre aux brides de bien agripper le métal.", done: false, tools: ["rag", "degreaser"] },
      { id: "s1-2", text: "Vérifier l'efficacité des freins avant et arrière : les patins de frein doivent être épais et fermes.", done: false, tools: ["safety_glasses", "wrench_10mm"] },
      { id: "s1-3", text: "S'assurer que les rayons de la roue arrière sont stables et bien tendus en les pinçant légèrement.", done: false, tools: ["spoke_wrench", "wrench_12mm"] }
    ]
  },
  {
    id: "step2",
    phase: "Core Mount",
    title: "Serrage de Sécurité du Bloc Moteur",
    description: "Le centrage du moteur dans le cadre définit l'équilibre général du vélo. Le moteur doit s'aligner parallèlement à la couronne pour éliminer les frictions.",
    sparkyTip: "Ne percez jamais votre cadre ! Si le tube de votre vélo est trop épais pour les étriers en U standard, utilisez la platine universelle ou sollicitez un adulte équipé de matériel de métallurgie.",
    difficulty: "Supervised",
    mechanicConcept: "Répartition du Couples : Un serrage excessif peut écraser ou déformer les tubes fins en aluminium. Serrez fermement et bloquez au frein filet bleu.",
    subtasks: [
      { id: "s2-1", text: "Réaliser un montage à blanc pour valider le passage du pédalier, de la bougie et du pot d'échappement.", done: false, tools: ["safety_glasses", "allen_keys"] },
      { id: "s2-2", text: "Placer des cales de caoutchouc élastomère sous les colliers de fixation pour absorber les sifflements vibratoires.", done: false, tools: ["scissors", "rubber_shims"] },
      { id: "s2-3", text: "Serrer les fixations avant et arrière de manière alternée par petites étapes pour éviter les contraintes de torsion.", done: false, tools: ["torque_wrench", "wrench_10mm", "threadlocker"] }
    ]
  },
  {
    id: "step3",
    phase: "Drive Train",
    title: "Serrage de la Couronne Arrière & Pose de la Chaîne",
    description: "Passons au système de transmission mécanique. Nous allons brider la couronne sur la roue et enfiler la robuste chaîne d'entraînement secondaire #415.",
    sparkyTip: "Le centrage de la roue d'entraînement est l'étape technique la plus délicate ! Faites tourner la roue et observez : assurez-vous qu'elle tourne rigoureusement rond sans oscillations latérales.",
    difficulty: "Challenging",
    mechanicConcept: "Coefficient de Friction : Un alignement incorrect dissipe la puissance motrice sous forme de chaleur intense, détruisant prématurément les roulements.",
    subtasks: [
      { id: "s3-1", text: "Nettoyer les rayons puis poser les deux disques amortisseurs en caoutchouc concentriquement au moyeu arrière.", done: false, tools: ["degreaser", "rag"] },
      { id: "s3-2", text: "Installer les brides de serrage en métal et serrer les 9 boulons selon un motif croisé en étoile inverse.", done: false, tools: ["wrench_10mm", "wrench_12mm", "torque_wrench"] },
      { id: "s3-3", text: "Enfiler la chaîne, ajuster la longueur à l'aide du dérive-chaîne et poser l'attache-rapide.", done: false, tools: ["chain_breaker", "pliers", "safety_glasses"] },
      { id: "s3-4", text: "Brider le galet tendeur de chaîne sur le cadre arrière et régler l'alignement pour avoir une flèche d'environ 1,2 cm.", done: false, tools: ["wrench_14mm", "wrench_10mm", "threadlocker"] }
    ]
  },
  {
    id: "step4",
    phase: "Fuel & Control",
    title: "Plomberie du Réservoir & Configuration des Commandes au Guidon",
    description: "Installons à présent les organes de vie de la machine. Fixation du réservoir d'essence par gravité, branchement des durites filtrées et pose de l'accélérateur et du coupe-circuit (massa).",
    sparkyTip: "L'essence requiert une prudence et un respect absolus. Réalisez toujours les transvasements de carburant à l'air libre. Évitez de créer des boucles vers le haut sur les durites.",
    difficulty: "Challenging",
    mechanicConcept: "Pression Hydrostatique & Circuit de Masse : Le robinet sous réservoir dépend de l'attraction terrestre. Le coupe-circuit dévie le potentiel vers le châssis.",
    subtasks: [
      { id: "s4-1", text: "Fixer solidement le réservoir au tube supérieur en intercalant des patins de feutre ou de caoutchouc.", done: false, tools: ["wrench_10mm", "screwdriver"] },
      { id: "s4-2", text: "Visser le robinet d'essence au réservoir, raccorder le filtre transparent et brancher proprement au carburateur.", done: false, tools: ["pliers", "scissors"] },
      { id: "s4-3", text: "Monter la poignée d'accélérateur rotative, le levier d'embrayage et le bouton rouge coupe-circuit sur votre guidon.", done: false, tools: ["allen_keys", "screwdriver"] },
      { id: "s4-4", text: "Connecter et isoler proprement les fils électriques de l'allumage avec de la gaine thermo protectrice contre la pluie.", done: false, tools: ["electrical_tape", "pliers"] }
    ]
  },
  {
    id: "step5",
    phase: "Final Tuning",
    title: "Réglage de la Friction d'Embrayage et Premier Ravitaillement",
    description: "La mécanique est en place ! Il convient maintenant d'ajuster le patinage de l'embrayage, de préparer l'huile et de finaliser les contrôles d'atelier.",
    sparkyTip: "Demandez de l'aide à un parent ou à un enseignant pour cette étape ! C'est le moment de réaliser le mélange carburant de rodage, conformément aux instructions de votre kit (souvent 16:1).",
    difficulty: "Supervised",
    mechanicConcept: "Viscosité et Coefficient d'Adhérence : L'huile spécialisée 2T protège le cylindre en mouvement. L'embrayage équilibre la tenue sous couple.",
    subtasks: [
      { id: "s5-1", text: "Préparer soigneusement le mélange d'huile synthétique 2T et d'essence sans plomb dans un jerrican homologué en extérieur.", done: false, tools: ["measuring_cup", "safety_glasses"] },
      { id: "s5-2", text: "Vérifier le coulissement libre de l'aiguille de gaz du boisseau de carburateur : elle doit revenir d'un coup de ressort sec.", done: false, tools: ["screwdriver", "pliers"] },
      { id: "s5-3", text: "Ajuster l'écrou cranté d'embrayage (flower nut) de manière à pouvoir pédaler librement avec le levier d'embrayage verrouillé au guidon.", done: false, tools: ["screwdriver", "wrench_14mm"] },
      { id: "s5-4", text: "Effectuer un essai de roulement à vide sans bougie : s'assurer du bon coulissement réciproque de l'équipage piston-vilebrequin.", done: false, tools: ["spark_plug_socket", "safety_glasses"] }
    ]
  }
];
