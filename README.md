# 🛠️ 2-Stroke Motorized Bicycle Assembly & Thermodynamic Lab

An immersive, fully interactive engineering simulator and educational platform designed for assembling, tuning, and understanding custom-motorized bicycles. Built with custom **React**, TypeScript, and styled using utility-first **Tailwind CSS**, this simulator acts as both a visual classroom and a mechanical safety verification workbench.

---

## 🌟 Interactive Modules & Simulation Mechanics

The application is structured into key, highly detailed, real-time modules:

### 1. 2-Stroke Thermodynamic Cylinder Lab (Stage 2)
An interactive mechanical simulator mimicking standard internal combustion physics:
*   **60 FPS Physics Simulation**: Built on high-rate continuous `requestAnimationFrame` render loops for liquid-smooth, sub-millisecond rotations.
*   **Realistic Crank-Slider Kinematics**: Computes exact trigonometry parameters on dynamic rotation angles $\theta$ to anchor the piston head, piston pin, connecting rod, and crankshaft counter-weight pin.
*   **Dynamic Combustion Fills**: Slipped inside the extended physical cylinder sheath, combustion states (Intake, Power, Exhaust) dynamically modify internal visual volumes to match real height positions.
*   **Speed Telemetry Tracking**: Accelerate virtual engines from **Idle (1,450 RPM)** through **Cruising (4,800 RPM)** up to the engine **Redline (8,250 RPM)**. 

### 2. Star-Pattern Torque Spec Simulator
Teaches structural tensioning practices to prevent casting fractures under high-frequency motor vibration:
*   **Continuous Star Sequence (Expected IDs 1 ➔ 2 ➔ 3 ➔ 4)**: Alternates diagonals to apply clamping pressure evenly.
*   **Two-Pass Tensioning Strategy**: Simulate dual-phase lock tightening—First pass snugging to **35%**, and second pass final spec lock down to **100% (18–22 Nm equivalent)**.
*   **Structural Strain Visualizer**: Built-in SVG stress indicator changes from safe neutral colors to deep warnings when bad bolt rotations are executed.

### 3. Progressive Engine Assembly Checklist
Step-by-step guidance system specifying safety, engine block seating, carburetion networks, CDI electronics, and chain alignments. Features:
*   Dynamic badges unlocked automatically on task completions.
*   In-app interactive guidelines.

### 4. Interactive Frame Hotspot Maps
Visual guide to engine placement and support systems:
*   CDI Coil & Spark systems.
*   Carburetor, throttle assemblies, and air filters.
*   Drive-chain, heavy-duty sprockets, and tensioner alignments.
*   Standard exhaust muffler pathways.

### 5. Compliance & Interactive Safety Quiz
A gamified classroom examining:
*   Fuel mixtures (comparing break-in ratios like 16:1 vs. regular 40:1 synthetic mix).
*   Correct chain tensioner adjustments.
*   Thermal heat warnings and thermal expansion properties of aluminum casings.

### 6. Mechanical Troubleshooting Chat
*   Wrench Assistance interface mock-powered for rapid component diagnostics.

---

## ⚙️ Construction and Development Setup

Ensure you have standard Node.js modern environments configured.

### 1. Installation
To pull initial development workspaces and populate dependencies:
```bash
npm install
```

### 2. Development Execution
Launch the local Hot Module Replacement server:
```bash
npm run dev
```

### 3. Production Compilation
Bundle assets and files ready for containers or static distributions:
```bash
npm run build
```

---

## 📦 Key Libraries Built-In
*   **Lucide React**: Clean, lightweight icons representing wrenches, warning indicators, and mechanics.
*   **Motion**: Smooth fade-in states and interactive transitions.
