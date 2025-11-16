const tasks = new Map();

export const createTaskStorage = (taskId, taskData) => {
  const now = Date.now();
  const task = {
    ...taskData,
    id: taskId,
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(taskId, task);
  return task;
};
export const getTask = (taskId) => {
  return tasks.get(taskId) || null;
};
export const updateTask = (taskId, updates) => {
  const task = tasks.get(taskId);
  if (!task) return null;
  Object.assign(task, updates, { updatedAt: Date.now() });
  return task;
};

export const deleteTask = (taskId) => {
  return tasks.delete(taskId);
};

setInterval(() => {
  const now = Date.now();
  const TTL = 10 * 60 * 1000;
  for (const [id, task] of tasks.entries()) {
    if (task?.createdAt && now - task.createdAt > TTL) {
      deleteTask(id);
    }
  }
}, 60_000);
