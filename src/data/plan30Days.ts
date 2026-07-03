import type { Exercise, Workout } from "../types";

export const PLAN_30_ID = "muscle-cut-30";

type ExSpec = {
  name: string;
  setsReps: string;
  youtubeUrl?: string;
  altName?: string;
  altYoutubeUrl?: string;
};

type DaySpec = {
  day: number;
  title: string;
  subtitle: string;
  exercises: ExSpec[];
};

/** 30-day hypertrophy + fat-loss (4 weeks). Progressive notes in sets/reps. */
const DAYS: DaySpec[] = [
  {
    day: 1,
    title: "Upper Power",
    subtitle: "Week 1 — chest, back, shoulders",
    exercises: [
      { name: "Barbell Bench Press", setsReps: "4 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-1pg", altName: "DB Bench", altYoutubeUrl: "https://www.youtube.com/watch?v=VmBVGCoG3gE" },
      { name: "Barbell Row", setsReps: "4 x 8-10", youtubeUrl: "https://www.youtube.com/watch?v=9efgcFjQaiA", altName: "Chest-Supported Row", altYoutubeUrl: "https://www.youtube.com/watch?v=9fItzuh9Iok" },
      { name: "Overhead Press", setsReps: "3 x 8-10", youtubeUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDg" },
      { name: "Lat Pulldown", setsReps: "3 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Lup0" },
      { name: "Face Pull", setsReps: "3 x 15", youtubeUrl: "https://www.youtube.com/watch?v=rep-qVOAyvg" },
      { name: "Finisher: Incline Push-ups", setsReps: "2 x AMRAP", altName: "Knee push-ups" },
    ],
  },
  {
    day: 2,
    title: "Lower Power",
    subtitle: "Week 1 — quads, hinges, calves",
    exercises: [
      { name: "Back Squat", setsReps: "4 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8", altName: "Goblet Squat", altYoutubeUrl: "https://www.youtube.com/watch?v=MeIiIdhvXTc" },
      { name: "Romanian Deadlift", setsReps: "4 x 8-10", youtubeUrl: "https://www.youtube.com/watch?v=1ED09jqOnIY", altName: "DB RDL" },
      { name: "Walking Lunges", setsReps: "3 x 12/leg", youtubeUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs" },
      { name: "Leg Curl", setsReps: "3 x 12-15", altName: "Nordic curl negatives" },
      { name: "Standing Calf Raise", setsReps: "4 x 12-15" },
      { name: "Finisher: Bike / walk", setsReps: "10 min Zone 2" },
    ],
  },
  {
    day: 3,
    title: "Conditioning + Core",
    subtitle: "Week 1 — fat-loss day",
    exercises: [
      { name: "Brisk Walk or Incline Treadmill", setsReps: "25-30 min", youtubeUrl: "https://www.youtube.com/watch?v=H76xUqXq8Do" },
      { name: "Dead Bug", setsReps: "3 x 10/side", youtubeUrl: "https://www.youtube.com/watch?v=4XLEnwUr5dE" },
      { name: "Pallof Press", setsReps: "3 x 12/side" },
      { name: "Plank", setsReps: "3 x 45-60 sec", youtubeUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c" },
      { name: "Hanging Knee Raise", setsReps: "3 x 10-12", altName: "Lying leg raise" },
    ],
  },
  {
    day: 4,
    title: "Push Hypertrophy",
    subtitle: "Week 1 — chest, shoulders, triceps",
    exercises: [
      { name: "Incline DB Press", setsReps: "4 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
      { name: "Cable Fly", setsReps: "3 x 12-15", altName: "DB fly" },
      { name: "Lateral Raise", setsReps: "4 x 12-15", youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
      { name: "Tricep Pushdown", setsReps: "3 x 12-15", youtubeUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU" },
      { name: "Overhead Tricep Extension", setsReps: "3 x 10-12" },
      { name: "Finisher: Push-up dropset", setsReps: "1 x max" },
    ],
  },
  {
    day: 5,
    title: "Pull Hypertrophy",
    subtitle: "Week 1 — back, biceps, rear delts",
    exercises: [
      { name: "Pull-Ups or Lat Pulldown", setsReps: "4 x 8-12", youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
      { name: "Seated Cable Row", setsReps: "4 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=GZbfzZJ8k4c" },
      { name: "Single-Arm DB Row", setsReps: "3 x 10/side" },
      { name: "Rear Delt Fly", setsReps: "3 x 15" },
      { name: "Barbell Curl", setsReps: "3 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo" },
      { name: "Hammer Curl", setsReps: "2 x 12" },
    ],
  },
  {
    day: 6,
    title: "Legs Hypertrophy",
    subtitle: "Week 1 — volume lower",
    exercises: [
      { name: "Leg Press", setsReps: "4 x 12-15", youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
      { name: "Bulgarian Split Squat", setsReps: "3 x 10/leg", youtubeUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE" },
      { name: "Leg Extension", setsReps: "3 x 12-15" },
      { name: "Seated Leg Curl", setsReps: "3 x 12-15" },
      { name: "Hip Thrust", setsReps: "3 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=SEd7q21L0yo" },
      { name: "Finisher: Stair climber", setsReps: "8 min moderate" },
    ],
  },
  {
    day: 7,
    title: "Recovery & Steps",
    subtitle: "Week 1 — active rest",
    exercises: [
      { name: "Easy Walk", setsReps: "8,000-10,000 steps" },
      { name: "World's Greatest Stretch", setsReps: "2 x 5/side", youtubeUrl: "https://www.youtube.com/watch?v=Kz7sUq0X7Q8" },
      { name: "Foam Roll Quads/Glutes", setsReps: "5 min" },
      { name: "Sleep Target", setsReps: "7-8 hrs (recovery)" },
    ],
  },
  {
    day: 8,
    title: "Upper Power+",
    subtitle: "Week 2 — add 1 set on compounds",
    exercises: [
      { name: "Barbell Bench Press", setsReps: "5 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-1pg", altName: "DB Bench" },
      { name: "Barbell Row", setsReps: "4 x 8-10", youtubeUrl: "https://www.youtube.com/watch?v=9efgcFjQaiA" },
      { name: "Overhead Press", setsReps: "4 x 8-10", youtubeUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDg" },
      { name: "Weighted Pull-Up", setsReps: "3 x 6-8", altName: "Lat pulldown heavy" },
      { name: "Lateral Raise", setsReps: "3 x 15" },
      { name: "Finisher: Battle ropes / bike", setsReps: "6 x 30s" },
    ],
  },
  {
    day: 9,
    title: "Lower Power+",
    subtitle: "Week 2 — heavier hinge focus",
    exercises: [
      { name: "Back Squat", setsReps: "5 x 5-6", youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
      { name: "Romanian Deadlift", setsReps: "4 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=1ED09jqOnIY" },
      { name: "Step-Ups", setsReps: "3 x 10/leg" },
      { name: "Leg Curl", setsReps: "4 x 10-12" },
      { name: "Calf Raise", setsReps: "4 x 15" },
      { name: "Finisher: Sled push / farmers walk", setsReps: "4 x 40m" },
    ],
  },
  {
    day: 10,
    title: "HIIT + Core",
    subtitle: "Week 2 — intervals",
    exercises: [
      { name: "Warm-up Jog", setsReps: "5 min" },
      { name: "Bike Intervals", setsReps: "8 x 30s hard / 90s easy" },
      { name: "Russian Twist", setsReps: "3 x 20" },
      { name: "Side Plank", setsReps: "3 x 40s/side" },
      { name: "Cool-down Walk", setsReps: "5 min" },
    ],
  },
  {
    day: 11,
    title: "Push Volume",
    subtitle: "Week 2",
    exercises: [
      { name: "Incline Barbell Press", setsReps: "4 x 8-10" },
      { name: "DB Shoulder Press", setsReps: "3 x 10-12" },
      { name: "Cable Crossover", setsReps: "3 x 12-15" },
      { name: "Skull Crushers", setsReps: "3 x 10-12", altName: "Overhead extension" },
      { name: "Dips", setsReps: "3 x 8-12", altName: "Bench dips" },
      { name: "Finisher: Lateral raise partials", setsReps: "2 x 20" },
    ],
  },
  {
    day: 12,
    title: "Pull Volume",
    subtitle: "Week 2",
    exercises: [
      { name: "Lat Pulldown", setsReps: "4 x 10-12", youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Lup0" },
      { name: "T-Bar Row", setsReps: "4 x 8-10", altName: "DB row" },
      { name: "Straight-Arm Pulldown", setsReps: "3 x 12" },
      { name: "Face Pull", setsReps: "3 x 15" },
      { name: "Incline Curl", setsReps: "3 x 10-12" },
      { name: "Cable Curl", setsReps: "2 x 15" },
    ],
  },
  {
    day: 13,
    title: "Legs Volume",
    subtitle: "Week 2",
    exercises: [
      { name: "Front Squat or Goblet", setsReps: "4 x 8-10" },
      { name: "Romanian Deadlift", setsReps: "3 x 10-12" },
      { name: "Walking Lunges", setsReps: "3 x 14/leg" },
      { name: "Leg Extension", setsReps: "3 x 15" },
      { name: "Leg Curl", setsReps: "3 x 15" },
      { name: "Finisher: Wall sit", setsReps: "2 x 60s" },
    ],
  },
  {
    day: 14,
    title: "Mobility + Steps",
    subtitle: "Week 2 — deload stress",
    exercises: [
      { name: "Walk", setsReps: "10,000 steps" },
      { name: "Hip 90/90", setsReps: "2 x 8/side" },
      { name: "Thoracic Rotation", setsReps: "2 x 10/side" },
      { name: "Band Pull-Aparts", setsReps: "3 x 20" },
    ],
  },
  {
    day: 15,
    title: "Full Body A",
    subtitle: "Week 3 — strength circuit",
    exercises: [
      { name: "Deadlift", setsReps: "4 x 5", youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q", altName: "Trap bar deadlift" },
      { name: "Bench Press", setsReps: "4 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-1pg" },
      { name: "Chin-Up", setsReps: "3 x 6-10", altName: "Lat pulldown" },
      { name: "Split Squat", setsReps: "3 x 8/leg" },
      { name: "Plank", setsReps: "3 x 60s" },
      { name: "Finisher: Row machine", setsReps: "500m hard" },
    ],
  },
  {
    day: 16,
    title: "Full Body B",
    subtitle: "Week 3",
    exercises: [
      { name: "Squat", setsReps: "4 x 6-8", youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
      { name: "Overhead Press", setsReps: "4 x 6-8" },
      { name: "Barbell Row", setsReps: "4 x 8" },
      { name: "Hip Thrust", setsReps: "3 x 10" },
      { name: "Farmer Carry", setsReps: "4 x 40m" },
      { name: "Finisher: Assault bike", setsReps: "10 cal x 5" },
    ],
  },
  {
    day: 17,
    title: "Cardio Capacity",
    subtitle: "Week 3 — fat-loss",
    exercises: [
      { name: "Incline Walk", setsReps: "35 min Zone 2" },
      { name: "KB Swing", setsReps: "5 x 15", youtubeUrl: "https://www.youtube.com/watch?v=YSxHifyI6s8" },
      { name: "Mountain Climbers", setsReps: "4 x 30s" },
      { name: "Dead Bug", setsReps: "3 x 12/side" },
    ],
  },
  {
    day: 18,
    title: "Push Heavy",
    subtitle: "Week 3 — top set focus",
    exercises: [
      { name: "Bench Press Top Set", setsReps: "1 x 4-6, then 3 x 8 back-off" },
      { name: "Incline DB Press", setsReps: "3 x 10" },
      { name: "Arnold Press", setsReps: "3 x 10" },
      { name: "Tricep Dips", setsReps: "3 x 8-12" },
      { name: "Cable Pushdown", setsReps: "3 x 12-15" },
      { name: "Finisher: Push-up burnout", setsReps: "max reps" },
    ],
  },
  {
    day: 19,
    title: "Pull Heavy",
    subtitle: "Week 3",
    exercises: [
      { name: "Weighted Pull-Up", setsReps: "4 x 5-8", altName: "Heavy pulldown" },
      { name: "Pendlay Row", setsReps: "4 x 6-8", altName: "Barbell row" },
      { name: "Chest-Supported Row", setsReps: "3 x 10" },
      { name: "Shrugs", setsReps: "3 x 12-15" },
      { name: "Preacher Curl", setsReps: "3 x 10" },
      { name: "Finisher: Face pulls", setsReps: "3 x 20" },
    ],
  },
  {
    day: 20,
    title: "Legs Heavy",
    subtitle: "Week 3",
    exercises: [
      { name: "Squat Top Set", setsReps: "1 x 4-6, 3 x 8 back-off" },
      { name: "RDL", setsReps: "4 x 6-8" },
      { name: "Leg Press", setsReps: "3 x 12" },
      { name: "Walking Lunge", setsReps: "3 x 12/leg" },
      { name: "Seated Calf", setsReps: "4 x 15" },
      { name: "Finisher: Bike sprint", setsReps: "6 x 20s" },
    ],
  },
  {
    day: 21,
    title: "Active Recovery",
    subtitle: "Week 3",
    exercises: [
      { name: "Easy Swim / Walk", setsReps: "30 min" },
      { name: "Yoga Sun Salutation", setsReps: "5 rounds" },
      { name: "Foam Roll", setsReps: "10 min" },
      { name: "Protein + water check", setsReps: "Hit daily targets" },
    ],
  },
  {
    day: 22,
    title: "Upper Pump",
    subtitle: "Week 4 — metabolic",
    exercises: [
      { name: "Superset: Bench + Row", setsReps: "4 x 10 each, no rest between" },
      { name: "Superset: OHP + Pulldown", setsReps: "3 x 12 each" },
      { name: "Lateral Raise", setsReps: "4 x 15" },
      { name: "Tricep Extension", setsReps: "3 x 15" },
      { name: "Bicep Curl", setsReps: "3 x 15" },
      { name: "Finisher: Rope pushdown", setsReps: "2 x 25" },
    ],
  },
  {
    day: 23,
    title: "Lower Pump",
    subtitle: "Week 4",
    exercises: [
      { name: "Goblet Squat", setsReps: "4 x 15" },
      { name: "RDL", setsReps: "3 x 12" },
      { name: "Leg Extension", setsReps: "3 x 20" },
      { name: "Leg Curl", setsReps: "3 x 20" },
      { name: "Calf Raise", setsReps: "4 x 20" },
      { name: "Finisher: Sled / walk incline", setsReps: "10 min" },
    ],
  },
  {
    day: 24,
    title: "Conditioning Circuit",
    subtitle: "Week 4 — peak fat burn",
    exercises: [
      { name: "Circuit x 4 rounds", setsReps: "45s work / 15s rest" },
      { name: "Goblet Squat", setsReps: "in circuit" },
      { name: "Push-Ups", setsReps: "in circuit" },
      { name: "KB Swing", setsReps: "in circuit" },
      { name: "Row Erg", setsReps: "250m finisher" },
    ],
  },
  {
    day: 25,
    title: "Push Deload",
    subtitle: "Week 4 — 70% effort",
    exercises: [
      { name: "Bench Press", setsReps: "3 x 8 @ RPE 7" },
      { name: "Incline Press", setsReps: "2 x 10" },
      { name: "Lateral Raise", setsReps: "2 x 15" },
      { name: "Tricep Pushdown", setsReps: "2 x 12" },
    ],
  },
  {
    day: 26,
    title: "Pull Deload",
    subtitle: "Week 4",
    exercises: [
      { name: "Lat Pulldown", setsReps: "3 x 10 @ RPE 7" },
      { name: "Cable Row", setsReps: "2 x 12" },
      { name: "Face Pull", setsReps: "2 x 15" },
      { name: "Curl", setsReps: "2 x 12" },
    ],
  },
  {
    day: 27,
    title: "Legs Deload",
    subtitle: "Week 4",
    exercises: [
      { name: "Leg Press", setsReps: "3 x 12 @ RPE 7" },
      { name: "RDL", setsReps: "2 x 10" },
      { name: "Split Squat", setsReps: "2 x 8/leg" },
      { name: "Calf Raise", setsReps: "2 x 15" },
    ],
  },
  {
    day: 28,
    title: "Test Day — Strength",
    subtitle: "Week 4 — optional PRs",
    exercises: [
      { name: "Bench AMRAP", setsReps: "1 x 5 @ moderate weight" },
      { name: "Squat AMRAP", setsReps: "1 x 5 @ moderate weight" },
      { name: "Pull-Up Max Set", setsReps: "1 x max reps" },
      { name: "Log photos + weight", setsReps: "Track progress" },
    ],
  },
  {
    day: 29,
    title: "Walk + Reflect",
    subtitle: "Transition — plan review",
    exercises: [
      { name: "Long Walk", setsReps: "45-60 min" },
      { name: "Stretch Full Body", setsReps: "15 min" },
      { name: "Plan Next Block", setsReps: "Repeat or +5% loads" },
    ],
  },
  {
    day: 30,
    title: "Graduation Workout",
    subtitle: "Celebrate — full body light",
    exercises: [
      { name: "Squat", setsReps: "3 x 8 @ feel-good weight" },
      { name: "Bench", setsReps: "3 x 8" },
      { name: "Row", setsReps: "3 x 10" },
      { name: "Core of choice", setsReps: "10 min" },
      { name: "Victory meal plan", setsReps: "Hit protein, stay on budget 😉" },
    ],
  },
];

function dayId(day: number) {
  return `plan30-day${String(day).padStart(2, "0")}`;
}

function exId(day: number, index: number) {
  return `${dayId(day)}-ex${String(index).padStart(2, "0")}`;
}

export function build30DayPlanWorkouts(): Workout[] {
  const createdAt = "2026-07-01T12:00:00.000Z";
  return DAYS.map((d) => ({
    id: dayId(d.day),
    name: `Day ${d.day} — ${d.title}`,
    programDay: d.day,
    programId: PLAN_30_ID,
    programNote: d.subtitle,
    createdAt,
    exercises: d.exercises.map((e, i): Exercise => ({
      id: exId(d.day, i),
      name: e.name,
      setsReps: e.setsReps,
      youtubeUrl: e.youtubeUrl,
      altName: e.altName,
      altYoutubeUrl: e.altYoutubeUrl,
    })),
  }));
}

export const PLAN_30_SUMMARY =
  "30 days · upper/lower/push/pull/legs · conditioning · progressive overload · deload week 4";