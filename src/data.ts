import { Hotspot, QuizQuestion, Achievement, EngineStage, AssemblyStep, VideoGuide } from "./types";

export const MOTORS_HOTSPOTS: Hotspot[] = [
  {
    id: "brakes",
    name: "Front & Rear Brakes",
    title: "Stopping Power Under Motor Load",
    description: "Your mountain bike was built for human pedal speeds. Adding an engine means you need reliable braking power. Classic pedal-backwards coaster brakes are dangerous on motorized bikes because if the chain slips, you cannot brake at all!",
    safetyProtocol: "Check that you have high-quality front and rear hand brakes (disc brakes are supreme, dual pull V-Brakes are good). Do NOT skip the front brake—it provides 70% of your stopping friction!",
    mechanicNote: "Speed and weight increase Kinetic Energy exponentially (E = 1/2 * m * v²). Tripling your speed increases your braking distance by 9 times! Keep your pads fresh.",
    coords: { x: 12, y: 38 },
    importance: "CRITICAL"
  },
  {
    id: "sprocket",
    name: "Rear Sprocket Cluster",
    title: "Rag Joint Wheel Interface",
    description: "The motor uses a separate drive chain connected to a sprocket clamped on your rear spokes. If this sprocket sits crooked or off-center by even a millimeter, the high-speed chain will slip off or bend your spokes.",
    safetyProtocol: "Tighten the 9-bolt rubber clamp (rag joint) in a star-pattern opposite sequence. Rotate the wheel and stand behind it—ensure the sprocket does not wiggle or look off-center.",
    mechanicNote: "Rotational Alignment: If the sprocket rotates eccentric (off-center), it pulls the chain with variable tension, creating extreme shock loads that break chain links.",
    coords: { x: 84, y: 72 },
    importance: "CRITICAL"
  },
  {
    id: "engine_mount",
    name: "Frame V-Triangle Block",
    title: "Secure Motor Clamping",
    description: "The engine sits right in the center of the frame. Because bike frame shapes vary, standard kit mounts might not snugly squeeze your downtube. Warning: Never drill a hole through the bike frame tube to bolt on the engine bracket!",
    safetyProtocol: "Use flat rubber shims between the mounting bracket and frame to save your paint and absorb vibration. Lock down the bracket with safety lock-washers or double nuts.",
    mechanicNote: "Stress Concentrations: A hole drilled in a steel or aluminum tube concentrates stress, making it snap easily under high-frequency engine vibration. Always wrap mounts around the tube!",
    coords: { x: 48, y: 55 },
    importance: "HIGH"
  },
  {
    id: "chain_tensioner",
    name: "Drive Chain Idler Pulley",
    title: "Chain Drive and Tensioner Safety",
    description: "To bridge the span from engine gear to rear wheel, you receive a heavy chain (#415) and a wheel pulley to guide it. If the tensioner bracket gets loose, it will swivel directly into your spinning rear tire spokes, locking up the wheel at full speed!",
    safetyProtocol: "Use a heavy-duty strap clamp or mount a stabilizing small bolt through the tensioner frame clamp to lock it in place permanently. Keep it tight!",
    mechanicNote: "Chain Tension and Sag: The optimal tension is when the chain can be pushed up/down by exactly 1/2 of an inch. Too tight stalls the motor; too loose details and jams.",
    coords: { x: 68, y: 74 },
    importance: "CRITICAL"
  },
  {
    id: "fuel_tank",
    name: "Top Tube Gas Tank",
    title: "Gravity Siphon Line Setup",
    description: "These simple custom bicycle gas tanks operate purely on gravity (no fuel pump!). Fuel flows downward from the tank, through a valve (petcock), into the carburetor fuel bowl.",
    safetyProtocol: "Route fuel lines with a clean downward slope. Never let them touch raw engine cylinder cooling fins! Install a clear, plastic fuel filter so you can spot dirt or air bubbles instantly.",
    mechanicNote: "Gravity Feed & Vapor Lock: If a hose bends upward, an air bubble gets trapped (Vapor Lock), completely blocking the flow. Also, standard gas contains ethanol which degrades plain rubber—use polyurethane lines!",
    coords: { x: 45, y: 30 },
    importance: "CRITICAL"
  },
  {
    id: "kill_switch",
    name: "Emergency Spark Kill Switch",
    title: "Ignition Grounding Button",
    description: "If your mechanical throttle or carburetor slide gets stuck wide-open (at full speed), trying to brake will just burn up the pads. You must be able to instantly shut down the spark ignition.",
    safetyProtocol: "Keep the wiring connectors wrapped in electrical tape or heat-shrink tubing to avoid random shorts when it rains. Always mount the red button right next to your left thumb!",
    mechanicNote: "Spark Circuit: The ignition coils (CDI) create a high-voltage pulse. The Kill Switch works by redirecting this electricity directly to the metal handlebar frame (grounding it out) so no spark flies inside the engine cylinder.",
    coords: { x: 28, y: 24 },
    importance: "CRITICAL"
  }
];

export const ENGINE_STAGES: EngineStage[] = [
  {
    id: "intake",
    name: "Intake & Compression",
    description: "As you pedal the bike and release the clutch, the piston is forced upward in the cylinder. As it ascends, it tightly pinches the gas-air mixture above it, compressing it to about 1/6th of its original size to maximize power. Below the piston, this upward motion creates a vacuum, sucking fresh fuel and vaporized 2-stroke lubrication oil from the carburetor into the engine crankcase.",
    physicsNotion: "Boyle's Law & Vacuum Pressure: Compressing a gas raises its temperature and mechanical potential density, setting it up for a fast, violent burn. The vacuum pressure inside the sealed crankcase operates similarly to a clinical syringe.",
    ventStatus: "Intake port OPEN, Exhaust port CLOSED",
    pistonPosition: "up",
    color: "#3b82f6"
  },
  {
    id: "power",
    name: "Ignition & Power Blowout",
    description: "Just as the piston reaches its highest point, the CDI generator sends a massive 15,000-volt electric current to the spark plug. A hot blue spark leaps across the gap, igniting the compressed gas fuel air. The gas flashes into flame, expanding rapidly. This sky-high thermal pressure kicks the piston straight down with massive torque. This downward mechanical hammer blow turns the crankshaft, driving your sprocket and chain!",
    physicsNotion: "Thermodynamics & Energy Transition: Chemical combustion converts stored fuel energy into high-temperature Thermal Energy. This pressure converts directly into Mechanical Force (Force = Pressure × Area of Piston Head).",
    ventStatus: "All Ports BLOCKED (Expanding Combustion Force)",
    pistonPosition: "down",
    color: "#ef4444"
  },
  {
    id: "exhaust",
    name: "Exhaust Smoke & Scavenging",
    description: "As the piston approaches the bottom of its stroke, it uncovers the exhaust port on the cylinder wall. The spent, high-pressure combustion exhaust gases escape out of the muffler. Immediately after, a transfer passage opens, allowing the fresh fuel charge that was squeezed below the piston to rush up into the upper cylinder, pushing out residual exhaust smoke (scavenging). The piston moves up again, starting the loop over!",
    physicsNotion: "Fluid Dynamics & Scavenging: The expansion speed of exiting exhaust smoke creates a kinetic vacuum behind it. This vacuum actually helps draw fresh intake charge from the crankcase into the main chamber so the engine can run smoothly.",
    ventStatus: "Exhaust Port OPEN, Cylinder Transfer Port OPEN",
    pistonPosition: "down",
    color: "#10b981"
  }
];

export const SAFETY_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Why of all rules must you mix special 2-stroke oil into the gasoline for this bicycle engine kit?",
    options: [
      "The oil dyes the gasoline blue so you know it is flammable.",
      "2-stroke bicycle engines don't have an oil reservoir, oil pump, or oil filter! The engine will grind metal-on-metal and melt (seize) inside 5 minutes unless oil is mixed right in the gas.",
      "The oil prevents the chain from sliding off the rear wheel gears.",
      "It makes the exhaust smoke smell like strawberry shortcake."
    ],
    correctIndex: 1,
    explanation: "Excellent job! Unlike a car, a simple 2-stroke bike motor relies on oil dissolved in the gasoline to lubricate the piston rings and crankshaft bearings. If you put straight gasoline in, the engine gets ruined instantly!",
    category: "Fuel & Torque"
  },
  {
    id: "q2",
    question: "Why are you strictly told NEVER to drill a bolt hole directly through your bike frame to mount the engine?",
    options: [
      "It will cause the metal to rust too fast.",
      "It will void the standard bicycle flat tire warrantee.",
      "Drilling frame tubes creates 'stress concentrations' where micro-cracks form. With engine vibrations, the metal will snap and the frame can break while riding!",
      "It makes the center of gravity too high."
    ],
    correctIndex: 2,
    explanation: "Spot on! Drilling round bicycle frame tubing completely compromises its structural engineering. Always use wrap-around clamps combined with soft rubber shims.",
    category: "Mechanics"
  },
  {
    id: "q3",
    question: "If your engine has a 10-tooth front sprocket and drives a 44-tooth rear wheel sprocket, what mechanical advantage do you have?",
    options: [
      "A 4.4 : 1 speed increase (your wheels spin 4.4 times faster than the engine crank).",
      "A 4.4 : 1 mechanical reduction ratio. The engine spins 4.4 times to turn your rear wheel once, trade speed for heavy torque.",
      "A direct 1-to-1 rotational link that keeps horse power equal to the speed.",
      "The sprockets lock out, meaning you can only ride backwards."
    ],
    correctIndex: 1,
    explanation: "Yes! 44 teeth divided by 10 teeth is a 4.4 reduction ratio. Simple mechanics teaches us that lowering RPM multipliers raises Torque, giving a low-power engine the power to push a heavy bike and rider up steep hills.",
    category: "Fuel & Torque"
  },
  {
    id: "q4",
    question: "What should you do if your gas bike throttle cable jams while driving, keeping the motor revving at high speed?",
    options: [
      "Pedal backwards as fast as possible to force the transmission to lock.",
      "Grab the brakes and immediately press your thumb Kill-Switch to shut off the engine spark.",
      "Let go of the handlebars and jump off the bike immediately.",
      "Lean forward and blow directly into the carburetor air intake filter."
    ],
    correctIndex: 1,
    explanation: "Super logic! Grabbing the brakes slows you down, but pressing thy Kill Switch instantly grounds the high-voltage CDI current, stopping the spark plug from firing and freezing the motor immediately.",
    category: "Safety"
  },
  {
    id: "q5",
    question: "How should you tighten the nine spoke clamp bolts when mounting the engine sprocket onto your wheel?",
    options: [
      "Tighten each bolt fully clockwise in direct numeric order around the wheel.",
      "Use a cross or 'star' pattern, tightening each bolt slightly at a time, to make sure the sprocket draws flush and spin straight.",
      "Just Hand-tighten them because tools might bend the spoke wires.",
      "Glue the sprocket on with construction glue and skip the bolts."
    ],
    correctIndex: 1,
    explanation: "Perfect! Tightening in a star pattern ensures even pressure distribution. If you tighten one side first, the sprocket will sit crooked, causing severe chain wobble and immediate derailment.",
    category: "First Ride"
  }
];

export const WORKSHOP_ACHIEVEMENTS: Achievement[] = [
  {
    id: "badge_inspect",
    title: "Safety Inspector",
    description: "Inspected all 6 safety hotspots on the interactive mountain bike schematic.",
    icon: "ClipboardCheck",
    status: "locked"
  },
  {
    id: "badge_engine",
    title: "Thermodynamics Explorer",
    description: "Successfully cycled through all three stages of the 2-stroke combustion simulator.",
    icon: "Flame",
    status: "locked"
  },
  {
    id: "badge_quiz",
    title: "Certified Build Crew",
    description: "Passed the Mechanic Safety Workshop Quiz with a perfect score!",
    icon: "ShieldAlert",
    status: "locked"
  },
  {
    id: "badge_checklist",
    title: "Master Assembler",
    description: "Checked off all 15 progress checklist tasks in the builder workbook.",
    icon: "Wrench",
    status: "locked"
  },
  {
    id: "badge_video",
    title: "Cinema Scholar",
    description: "Reviewed the video school modules and confirmed safety takeaways.",
    icon: "Tv",
    status: "locked"
  }
];

export const VIDEO_GUIDES: VideoGuide[] = [
  {
    id: "v_sprocket",
    title: "Mastering Sprocket Alignment & Rag Joint Clamps",
    description: "Learn how to clamp the rear drive-chain sprocket to your bike's spokes. Doing this wrong causes chain jumps, broken spokes, and dangerous lock-ups, but this video teaches you the golden rule of alignment.",
    youtubeUrl: "https://www.youtube.com/embed/8nMsIB8SeDc",
    thumbnailUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=640",
    duration: "4:15",
    category: "Drive Train Setup",
    safetyPrecaution: "Never work on spokes with tensioned chains on the gears. Tighten the bolts in an opposite star-pattern to prevent bending your spokes.",
    mechanicConcept: "Concentricity and Alignment: Centripetal force at speeds can shred off-center sprockets. Ensuring concentric wobble-tolerance below 1mm is mandatory.",
    chapters: [
      { time: "0:00", title: "Introduction & Tool Checklist", description: "Choosing the 9-bolt kits, rubber backing rings, and dual crescent wrenches." },
      { time: "1:10", title: "Concentric Fit Mounting", description: "Centering the sprocket over the bike's rear axle hub. Measure twice!" },
      { time: "2:30", title: "The Star Pattern Tightening", description: "Bolting opposing sides in small turns. Keeps spokes balanced under severe torque." },
      { time: "3:45", title: "Wobble Runout Test", description: "Spinning the wheel in the frame to visualize side-to-side wobble before locking down." }
    ]
  },
  {
    id: "v_engine",
    title: "Engine Mounting: Centering & Vibration Damping",
    description: "A secure and vibration-resistant mounting inside the bike triangle frame is key. We explain the 'V' bracket fit, thermal space safety limits, and why drilling holds in frame is forbidden.",
    youtubeUrl: "https://www.youtube.com/embed/TpAhGueJeQQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=640",
    duration: "3:40",
    category: "Engine Assembly",
    safetyPrecaution: "Adult supervision required while lifting the motor. Wear steel-toed boots. Under no condition should you drill directly through any frame load support tube.",
    mechanicConcept: "Vibration Dampening & Structural Stress: Dynamic engine loads convert into micro-cracks at drilled points. Soft elastomer sleeves protect the tube's outer skin.",
    chapters: [
      { time: "0:00", title: "Frame Dry-Fit Run", description: "Positioning the fuel petcock and magneto wire route for exhaust headroom." },
      { time: "0:55", title: "Sensing Clearence Constraints", description: "Verifying the metal pedal cranks pass the clutch housing with 5mm clearance." },
      { time: "2:00", title: "Placing Elastomer Dampers", description: "Installing protective dense plastic/rubber pads to prevent direct steel abrasion." },
      { time: "3:10", title: "Torquing nuts sequentially", description: "Leveraging double locking nuts and blue thread sealant on the cylinder posts." }
    ]
  },
  {
    id: "v_chain",
    title: "Chain Breaking & Idler Tensioner Adjustment",
    description: "Fitting the high-load #415 chain! This video covers breaking links to length, matching exact path runout, and locking down the dynamic roller wheel tensioner safely.",
    youtubeUrl: "https://www.youtube.com/embed/0z3f5Mc6WO0",
    thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=640",
    duration: "5:10",
    category: "Drive Train Setup",
    safetyPrecaution: "If the tensioner loosens, it will swivel into the spokes, throwing you off. Use sprocket guards and frame locking plates absolute always.",
    mechanicConcept: "Chain Slack Resonance: Over-tightened chains strain the crank magnet. Loose chains whip violently, risking crank-case punctures.",
    chapters: [
      { time: "0:00", title: "Using the Chain Breaker", description: "Squeezing out steel pins safely without bending the inner links." },
      { time: "1:25", title: "Installing the Master Link Switch", description: "Snapping the lock clip on so the closed side faces the direction of travel." },
      { time: "3:10", title: "Securing the Tensioner Bracket", description: "Fitting locking nuts and a stabilization frame bolt to prevent rotating into raw spokes." },
      { time: "4:30", title: "Testing 1/2-Inch Sag Rules", description: "Measuring tension manually at bottom-span travel for optimal torque trade-off." }
    ]
  },
  {
    id: "v_fuel",
    title: "Fuel Mixtures, Lubrication, & Anti-Vapor Lock Plumbing",
    description: "Getting the chemistry right! See how to measure the exact 40:1 break-in ratio of oil, keep gasoline lines flowing downwards safely, and avoid CDI circuit rainwater shorts.",
    youtubeUrl: "https://www.youtube.com/embed/Thw5SEyzLmg",
    thumbnailUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=640",
    duration: "4:00",
    category: "Fuel Tuning",
    safetyPrecaution: "Gasoline mix must be performed outdoors. Never handle fuels near ignition sources or with gas heaters nearby. Always wear work gloves.",
    mechanicConcept: "Gravity Feed Incline & Lubrication Viscosity: Siphon relies on atmospheric static pressure. Any high-bend trap blocks fuel, causing spark ignition drops.",
    chapters: [
      { time: "0:00", title: "The 2-Stroke Mix Math", description: "Calculating exact ounces of oil per gallon. 16:1 for engine break-in; 40:1 later." },
      { time: "1:15", title: "Mounting the Tank Security", description: "Cushioning metal-on-metal with frame spacers. Avoid tight pinches." },
      { time: "2:20", title: "Plumbing Downward Flow Pipes", description: "Clipping the inline fuel filter. Always verify gravity paths decline steadily." },
      { time: "3:30", title: "Ignition CDI Wire Insulation", description: "Crimping kill switch cables properly, heat-shrinking to seal out rain." }
    ]
  }
];

export const ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    id: "step1",
    phase: "Preparation",
    title: "Pre-Flight Frame Inspection & Tool Preparation",
    description: "Before you start bolting heavy metal blocks onto your bicycle, we must inspect the chassis to ensure it is robust enough to survive motorization.",
    sparkyTip: "Gather your tools first! You'll need basic metric wrenches (mostly 10mm, 12mm, 14mm), a screwdriver, Allen/hex keys, clean rags, and a bottle of blue threadlocker (Loctite).",
    difficulty: "Easy",
    mechanicConcept: "Structural Health: Inspect the frame for weld cracks, especially near the bottom bracket. Motorized vibrations find metal weaknesses fast!",
    subtasks: [
      { id: "s1-1", text: "Scrub the bike frame V-triangle clean of all grease and dirt so clamps grip tight.", done: false, tools: ["rag", "degreaser"] },
      { id: "s1-2", text: "Verify both hand brakes are responsive and pad rubber has plenty of thickness.", done: false, tools: ["safety_glasses", "wrench_10mm"] },
      { id: "s1-3", text: "Confirm standard rear wheel spokes are stout (gently squeeze them to check they aren't loose).", done: false, tools: ["spoke_wrench", "wrench_12mm"] }
    ]
  },
  {
    id: "step2",
    phase: "Core Mount",
    title: "Securing the Engine block inside the Frame Triangle",
    description: "Aligning the engine bracket is key to central weight balance. The motor must line up flush with the rear gear to avoid chain friction.",
    sparkyTip: "Do not drill slots in your frame! If your frame downtube is too thick for the kit's u-bolt clamp, search your pack for the specialized 'Universal Mounting Adapter plate' or consult an adult with metal shop experience.",
    difficulty: "Supervised",
    mechanicConcept: "Torque Distribution: Tightening standard clamps too much can warp fragile aluminum tubes. Tighten snug, then add 'Blue Threadlocker' to keep nuts from backing out.",
    subtasks: [
      { id: "s2-1", text: "Dry-fit the engine to verify it clears your pedals, spark plug head, and exhaust.", done: false, tools: ["safety_glasses", "allen_keys"] },
      { id: "s2-2", text: "Place thin sheet-rubber strips on frame tubes where clamps touch to stifle buzz vibration.", done: false, tools: ["scissors", "rubber_shims"] },
      { id: "s2-3", text: "Bolted and torqued the front and rear mounts in small steps to prevent binding.", done: false, tools: ["torque_wrench", "wrench_10mm", "threadlocker"] }
    ]
  },
  {
    id: "step3",
    phase: "Drive Train",
    title: "Rear Sprocket Alignment & Drive Chain Setup",
    description: "Now we build the transmission link! We must clamp the driven gear to the rear spokes and string the #415 power-drive chain to the motor gear.",
    sparkyTip: "Aligning sprocket rotation is the trickiest step of the build! Have a buddy spin the rear wheel while you watch-assure the metal gear rotates perfectly straight without side-wobble.",
    difficulty: "Challenging",
    mechanicConcept: "Coefficient of Friction: Chain stretch and cog alignment. A misaligned chain converts valuable drive power into rubbing heat, breaking links in seconds.",
    subtasks: [
      { id: "s3-1", text: "Clean spoke wires, then install both rubber rags concentric around the rear wheel hub.", done: false, tools: ["degreaser", "rag"] },
      { id: "s3-2", text: "Assemble 9 spokes backing plates and tighten the hex bolts in a cross pattern (Star Sequence).", done: false, tools: ["wrench_10mm", "wrench_12mm", "torque_wrench"] },
      { id: "s3-3", text: "Route the drive chain, adjust link count using a chain breaker tool, and install the Master Link.", done: false, tools: ["chain_breaker", "pliers", "safety_glasses"] },
      { id: "s3-4", text: "Double-bolt the drive tensioner wheel pulley and test-spin to secure 1/2 inch of vertical sag.", done: false, tools: ["wrench_14mm", "wrench_10mm", "threadlocker"] }
    ]
  },
  {
    id: "step4",
    phase: "Fuel & Control",
    title: "Plumbing the Fuel Tank & Setting Handlebar Cockpit Controls",
    description: "Time to hook up the life-blood lines. We must fasten the gas tank, connect gravity fuel feed pipes, and fit the CDI throttle kill switches on the handlebars.",
    sparkyTip: "Gasoline requires absolute respect. Always handle fuels outdoors. Keep the plastic fuel filter pointed straight down, with no rising loops that would choke gravity feed pressure.",
    difficulty: "Challenging",
    mechanicConcept: "Atmospheric Pressure & Spark Splicing: Cap relative vacuum. Kill switch redirects current wire to grounding chassis, snuffing spark plug potential instantly.",
    subtasks: [
      { id: "s4-1", text: "Strap the gasoline tank to the main top tube using the kit's padded steel brackets.", done: false, tools: ["wrench_10mm", "screwdriver"] },
      { id: "s4-2", text: "Lock the fuel valve/petcock tight, slide clear hoses through a fuel filter, and snap onto carburetor inlet.", done: false, tools: ["pliers", "scissors"] },
      { id: "s4-3", text: "Mount throttle twist-grip, clutch lever and CDI kill-switch button directly on handbar slots.", done: false, tools: ["allen_keys", "screwdriver"] },
      { id: "s4-4", text: "Connect kill switch wires using insulated connectors, taped well against splashing rain.", done: false, tools: ["electrical_tape", "pliers"] }
    ]
  },
  {
    id: "step5",
    phase: "Final Tuning",
    title: "The Workshop Pre-Flight Check & Clutch Friction Adjustments",
    description: "Your build is mounted! Now we verify the clutch slips when held, oil and fuel is blended, and basic systems checks are ticked.",
    sparkyTip: "Ask a parent or teacher to assist for this step! This is where we create the special 'break-in' mix of fuel. Use 16:1 or 40:1 as suggested in your kit's user manual.",
    difficulty: "Supervised",
    mechanicConcept: "Viscosity Index & Friction Coefficient: 2-stroke oil thickens gasoline, protecting sliding cylinders. Clutch tuning balances lock-load and spring pressure.",
    subtasks: [
      { id: "s5-1", text: "Mix 2-Stroke Synthetic Motor Oil and Regular Gas inside a dedicated gas container (strictly outdoor).", done: false, tools: ["measuring_cup", "safety_glasses"] },
      { id: "s5-2", text: "Adjust the carburetor throttle needle play so cable slides open and snaps closed like a spring.", done: false, tools: ["screwdriver", "pliers"] },
      { id: "s5-3", text: "Tune the flower clutch nut on the gears to ensure standard bike pedaling works with lever pulled.", done: false, tools: ["screwdriver", "wrench_14mm"] },
      { id: "s5-4", text: "Perform a dry-run push test with spark plug out: verify the piston fires back-and-forth smoothly.", done: false, tools: ["spark_plug_socket", "safety_glasses"] }
    ]
  }
];
