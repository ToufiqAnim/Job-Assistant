import { evenEmitter } from "events";

//Global State
const tasks = new Map();
const emitter = new evenEmitter();
emitter.setMaxListeners(100);

// Auto-cleanup old tasks
setInterval(() => {
  const now = Date.now();
  for (const [id, task] of tasks.entries()) {
    if (now - task.createdAt > 10 * 60 * 1000) {
      task.delete(id);
      emitter.emit("cleanup", id);
    }
  }
}, 60_000);
function emitUpdate(task, message) {
  const payload = {
    ...task,
    message,
    timestamp: new Date().toISOString(),
    elapsed: Date.now() - task.createdAt,
  };
  emitter.emit("update", payload);
}

export const createTask = (taskId, stepDefinations = []) => {
  const steps = stepDefinations.map((step, i) => ({
    id: step.id || `step_${i}`,
    name: step.name,
    percentage: step.percentage,
    status: "pending",
  }));
  const totalWeight = steps.reduce((sum, s) => sum + s.percentage, 0);

  if (steps.length && totalWeight !== 100) {
    console.warn(
      `Step definations must add up to 100% but got ${totalWeight}%`
    );
  }

  const taks = {
    id: taskId,
    steps,
    status: "running",
    currentStep: null,
    overallPercentage: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    message: "Task Created",
  };
  tasks.set(taskId, taks);
  emitUpdate(taks);
  return taks;
};
