import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteTask, listTasks, saveTask } from "../db";
import type { Priority, Task } from "../types";
import { todayISO, uid } from "../types";
import { confirmDelete, useAsync } from "../utils";
import { HomeHeader } from "../components/HomeHeader";
import { Collapsible, ProgressRing, priorityBadge, priorityClass } from "../components/ui";

export function TodoPage() {
  const { data: tasks, reload } = useAsync(listTasks, []);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Priority>("med");
  const [editing, setEditing] = useState<Task | null>(null);

  const today = todayISO();
  const { active, done, todayDone, todayTotal } = useMemo(() => {
    const list = tasks ?? [];
    const active = list.filter((t) => !t.completed);
    const done = list.filter((t) => t.completed);
    const todayTasks = list.filter((t) => !t.dueDate || t.dueDate <= today);
    const todayTotal = todayTasks.length;
    const todayDone = todayTasks.filter((t) => t.completed).length;
    return { active, done, todayDone, todayTotal };
  }, [tasks, today]);

  async function addOrUpdate() {
    if (!title.trim()) return;
    if (editing) {
      await saveTask({ ...editing, title: title.trim(), dueDate: due || undefined, priority });
    } else {
      const t: Task = {
        id: uid(),
        title: title.trim(),
        dueDate: due || undefined,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await saveTask(t);
    }
    setTitle("");
    setDue("");
    setPriority("med");
    setEditing(null);
    await reload();
  }

  async function toggle(task: Task) {
    await saveTask({
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
    });
    await reload();
  }

  async function remove(task: Task) {
    if (!confirmDelete(`"${task.title}"`)) return;
    await deleteTask(task.id);
    await reload();
  }

  function startEdit(task: Task) {
    setEditing(task);
    setTitle(task.title);
    setDue(task.dueDate ?? "");
    setPriority(task.priority);
  }

  return (
    <div className="pb-28">
      <HomeHeader subtitle="Tasks. Done. No negotiation." />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
        <div className="card flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase tracking-wider text-ash">Today</p>
            <p className="text-lg font-semibold">Daily grind</p>
          </div>
          <ProgressRing done={todayDone} total={todayTotal} />
        </div>

        <div className="card space-y-3">
          <h2 className="font-display text-lg font-semibold uppercase">{editing ? "Edit task" : "Add task"}</h2>
          <input
            className="input-field"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="input-field flex-1"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
            <select
              className="input-field w-28"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="low">Low</option>
              <option value="med">Med</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-primary flex-1" onClick={() => void addOrUpdate()}>
              <Plus className="mr-1 inline h-4 w-4" />
              {editing ? "Save" : "Add"}
            </button>
            {editing ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setDue("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-ash">Active</h2>
          {active.length === 0 ? (
            <p className="text-sm text-ash">Nothing left. Add something hard.</p>
          ) : (
            active.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={() => void toggle(t)} onEdit={() => startEdit(t)} onDelete={() => void remove(t)} />
            ))
          )}
        </section>

        <Collapsible title="Done" count={done.length}>
          {done.length === 0 ? (
            <p className="text-sm text-ash">No completed tasks yet.</p>
          ) : (
            done.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={() => void toggle(t)} onEdit={() => startEdit(t)} onDelete={() => void remove(t)} />
            ))
          )}
        </Collapsible>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`card flex gap-3 ${priorityClass[task.priority]} ${task.completed ? "opacity-60" : ""}`}>
      <button
        type="button"
        aria-label={task.completed ? "Mark incomplete" : "Complete"}
        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
          task.completed ? "border-blood bg-blood text-white" : "border-steel bg-steel"
        }`}
        onClick={onToggle}
      >
        <Check className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {priorityBadge(task.priority)}
          {task.dueDate ? <span className="text-xs text-ash">Due {task.dueDate}</span> : null}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <button type="button" className="rounded-lg p-2 text-ash hover:bg-steel" onClick={onEdit} aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-lg p-2 text-blood hover:bg-steel" onClick={onDelete} aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}