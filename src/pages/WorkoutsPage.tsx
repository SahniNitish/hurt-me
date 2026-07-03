import {
  Check,
  ChevronLeft,
  ExternalLink,
  Plus,
  RotateCcw,
  Trash2,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteWorkout,
  getSessionChecks,
  getSettings,
  importPlan30Days,
  listWorkouts,
  resetWorkoutSession,
  saveWorkout,
  setExerciseChecked,
} from "../db";
import { PLAN_30_ID, PLAN_30_SUMMARY } from "../data/plan30Days";
import type { Exercise, Workout } from "../types";
import { uid } from "../types";
import { confirmDelete, useAsync, youtubeEmbedUrl, youtubeWatchUrl } from "../utils";
import { HomeHeader } from "../components/HomeHeader";

export function WorkoutsPage() {
  const { data: workouts, reload } = useAsync(listWorkouts, []);
  const { data: settings, reload: reloadSettings } = useAsync(getSettings, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [planMsg, setPlanMsg] = useState("");

  const planDays = (workouts ?? [])
    .filter((w) => w.programId === PLAN_30_ID)
    .sort((a, b) => (a.programDay ?? 0) - (b.programDay ?? 0));
  const customDays = (workouts ?? []).filter((w) => w.programId !== PLAN_30_ID);

  async function installPlan() {
    const r = await importPlan30Days();
    setPlanMsg(r.skipped ? "30-day plan already installed." : `Added ${r.added} workout days.`);
    await reload();
    await reloadSettings();
    if (r.added > 0) setSelectedId("plan30-day01");
  }

  const selected = workouts?.find((w) => w.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    void getSessionChecks(selectedId).then(setChecks);
  }, [selectedId, workouts]);

  async function createWorkout() {
    if (!draftName.trim()) return;
    const w: Workout = {
      id: uid(),
      name: draftName.trim(),
      exercises: [],
      createdAt: new Date().toISOString(),
    };
    await saveWorkout(w);
    setDraftName("");
    setShowForm(false);
    await reload();
    setSelectedId(w.id);
  }

  async function removeWorkout(w: Workout) {
    if (!confirmDelete(`workout "${w.name}"`)) return;
    await deleteWorkout(w.id);
    if (selectedId === w.id) setSelectedId(null);
    await reload();
  }

  if (selected) {
    return (
      <WorkoutDetail
        workout={selected}
        checks={checks}
        onBack={() => setSelectedId(null)}
        onReload={async () => {
          await reload();
          setChecks(await getSessionChecks(selected.id));
        }}
        onSave={async (w) => {
          await saveWorkout(w);
          await reload();
        }}
      />
    );
  }

  return (
    <div className="pb-28">
      <HomeHeader subtitle="30-day muscle + fat loss, or your own days." />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {!settings?.plan30DaysImported && planDays.length === 0 ? (
          <div className="card space-y-3 border-ember/40">
            <p className="font-display text-lg font-semibold uppercase text-ember">30-day program</p>
            <p className="text-sm text-ash">{PLAN_30_SUMMARY}</p>
            <button type="button" className="btn-primary w-full" onClick={() => void installPlan()}>
              Install 30-day plan (Day 1–30)
            </button>
          </div>
        ) : null}
        {planMsg ? <p className="text-center text-sm text-sage">{planMsg}</p> : null}

        <button type="button" className="btn-primary w-full" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 inline h-5 w-5" />
          New workout day
        </button>
        {showForm ? (
          <div className="card space-y-3">
            <input
              className="input-field"
              placeholder="e.g. Pull Day"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="button" className="btn-primary flex-1" onClick={() => void createWorkout()}>
                Create
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {planDays.length > 0 ? (
          <>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ember">30-day plan</h2>
            <ul className="space-y-2">
              {planDays.map((w) => (
                <WorkoutListItem key={w.id} w={w} onOpen={() => setSelectedId(w.id)} onDelete={() => void removeWorkout(w)} />
              ))}
            </ul>
          </>
        ) : null}

        {customDays.length > 0 ? (
          <>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ash">Your workouts</h2>
            <ul className="space-y-2">
              {customDays.map((w) => (
                <WorkoutListItem key={w.id} w={w} onOpen={() => setSelectedId(w.id)} onDelete={() => void removeWorkout(w)} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

function WorkoutListItem({
  w,
  onOpen,
  onDelete,
}: {
  w: Workout;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <li>
      <div className="card flex items-center gap-3">
        <button type="button" className="min-h-12 flex-1 text-left font-display text-xl font-semibold uppercase" onClick={onOpen}>
          {w.name}
          <p className="mt-0.5 font-body text-xs font-normal normal-case text-ash">
            {w.programNote ?? `${w.exercises.length} exercises`}
          </p>
        </button>
        <button type="button" className="rounded-lg p-3 text-blood" onClick={onDelete} aria-label="Delete workout">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}

function WorkoutDetail({
  workout,
  checks,
  onBack,
  onReload,
  onSave,
}: {
  workout: Workout;
  checks: Record<string, boolean>;
  onBack: () => void;
  onReload: () => Promise<void>;
  onSave: (w: Workout) => Promise<void>;
}) {
  const [exForm, setExForm] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3 x 10");
  const [yt, setYt] = useState("");
  const [altName, setAltName] = useState("");
  const [altYt, setAltYt] = useState("");
  const [embedId, setEmbedId] = useState<string | null>(null);

  const done = workout.exercises.filter((e) => checks[e.id]).length;

  async function addExercise() {
    if (!name.trim()) return;
    const ex: Exercise = {
      id: uid(),
      name: name.trim(),
      setsReps: sets.trim(),
      youtubeUrl: yt.trim() || undefined,
      altName: altName.trim() || undefined,
      altYoutubeUrl: altYt.trim() || undefined,
    };
    await onSave({ ...workout, exercises: [...workout.exercises, ex] });
    setName("");
    setSets("3 x 10");
    setYt("");
    setAltName("");
    setAltYt("");
    setExForm(false);
    await onReload();
  }

  async function removeExercise(exId: string) {
    if (!confirmDelete("this exercise")) return;
    await onSave({ ...workout, exercises: workout.exercises.filter((e) => e.id !== exId) });
    await onReload();
  }

  return (
    <div className="pb-28">
      <header className="border-b border-steel px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <button type="button" className="mb-2 flex min-h-10 items-center gap-1 text-ash" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <h1 className="font-display text-3xl font-bold uppercase">{workout.name}</h1>
        {workout.programNote ? <p className="text-sm text-ember">{workout.programNote}</p> : null}
        <p className="text-sm text-ash">
          Session: {done}/{workout.exercises.length} done
        </p>
        <button
          type="button"
          className="btn-ghost mt-3 w-full text-sm"
          onClick={async () => {
            await resetWorkoutSession(workout.id);
            await onReload();
          }}
        >
          <RotateCcw className="mr-2 inline h-4 w-4" />
          Reset session for next gym day
        </button>
      </header>

      <div className="mx-auto max-w-lg space-y-3 px-4 py-4">
        {embedId ? (
          <div className="card overflow-hidden p-0">
            <iframe
              title="Exercise demo"
              className="aspect-video w-full"
              src={embedId}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button type="button" className="w-full py-2 text-sm text-ash" onClick={() => setEmbedId(null)}>
              Close video
            </button>
          </div>
        ) : null}

        {workout.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            checked={!!checks[ex.id]}
            onToggle={async () => {
              await setExerciseChecked(workout.id, ex.id, !checks[ex.id]);
              await onReload();
            }}
            onDelete={() => void removeExercise(ex.id)}
            onEmbed={(url) => setEmbedId(youtubeEmbedUrl(url))}
          />
        ))}

        <button type="button" className="btn-ghost w-full" onClick={() => setExForm(true)}>
          <Plus className="mr-2 inline h-4 w-4" /> Add exercise
        </button>

        {exForm ? (
          <div className="card space-y-3">
            <input className="input-field" placeholder="Exercise name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input-field" placeholder="Sets x reps" value={sets} onChange={(e) => setSets(e.target.value)} />
            <input className="input-field" placeholder="YouTube URL (demo)" value={yt} onChange={(e) => setYt(e.target.value)} />
            <input className="input-field" placeholder="Alternative exercise" value={altName} onChange={(e) => setAltName(e.target.value)} />
            <input className="input-field" placeholder="Alt YouTube URL" value={altYt} onChange={(e) => setAltYt(e.target.value)} />
            <button type="button" className="btn-primary w-full" onClick={() => void addExercise()}>
              Save exercise
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExerciseCard({
  ex,
  checked,
  onToggle,
  onDelete,
  onEmbed,
}: {
  ex: Exercise;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEmbed: (url?: string) => void;
}) {
  const main = youtubeWatchUrl(ex.youtubeUrl);
  const alt = youtubeWatchUrl(ex.altYoutubeUrl);

  return (
    <div className={`card ${checked ? "border-blood/50 bg-blood/5" : ""}`}>
      <div className="flex gap-3">
        <button
          type="button"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${
            checked ? "border-blood bg-blood" : "border-steel bg-steel"
          }`}
          onClick={onToggle}
        >
          <Check className="h-6 w-6 text-white" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold uppercase">{ex.name}</p>
          <p className="text-sm text-ember">{ex.setsReps}</p>
          {ex.altName ? (
            <p className="mt-1 text-xs text-ash">
              Alt: <span className="text-white">{ex.altName}</span>
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            {main ? (
              <>
                <a href={main} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-steel px-3 text-sm">
                  <Youtube className="h-4 w-4 text-blood" /> Demo
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button type="button" className="btn-ghost min-h-10 px-3 text-sm" onClick={() => onEmbed(ex.youtubeUrl)}>
                  Play inline
                </button>
              </>
            ) : null}
            {alt ? (
              <a href={alt} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-steel px-3 text-sm text-ash">
                Alt demo <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>
        <button type="button" className="p-2 text-blood" onClick={onDelete} aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}