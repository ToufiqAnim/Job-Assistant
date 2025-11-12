export const ProgressTracker = (taskId = null) => {
  const internalTaskId = taskId || `task_${Date.now()}`;
  const callbacks = [];
  let steps = [];
  let currentStep = null;
  const startTime = Date.now();

  const emit = (progressData) => {
    const data = {
      taskId: internalTaskId,
      timeStamp: new Date().toISOString(),
      elapsedTime: Date.now() - startTime,
      ...progressData,
    };
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error("Progress callback error:", error);
      }
    });
  };

  const onProgress = (callback) => {
    if (typeof callback === "function") {
      callbacks.push(callback);
    }
  };

  const defineSteps = (stepDefinitions) => {
    steps = stepDefinitions.map((step, index) => ({
      id: step.id || `step_${index}`,
      name: step.name,
      parcentage: step.parcentage || 0,
      status: "pending",
    }));
  };

  const startStep = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      step.status = "in-progress";
      step.startTime = Date.now();
      currentStep = step;
    }
    emit({
      step: stepId,
      name: step.name,
      parcentage: step.parcentage,
      status: "in-progress",
      message: `Starting  ${step.name}`,
    });
    console.debug(`Starting step ${step.name}...`);
  };
  const completeStep = (stepId, message = null) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      step.status = "completed";
      step.endTime = Date.now();
      step.duration = step.endTime - step.startTime;
    }
    emit({
      step: stepId,
      name: step.name,
      parcentage: step.parcentage,
      status: "completed",
      message: message || `Completed: ${step.name}`,
      duration: step.duration,
    });
    console.info(`✅ Step completed: ${step.name} (${step.duration}ms)`);
  };
  const updateProgress = (stepId, parcentage, message = null) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      step.status = parcentage;
    }
    emit({
      step: stepId,
      name: step.name,
      parcentage,
      status: "in_progress",
      message: message || step.name,
    });
    console.info(`✅ Step completed: ${step.name} (${step.duration}ms)`);
  };
  const complete = (result = null) => {
    const totalTime = Date.now() - startTime;
    emit({
      step: "Complete",
      name: "Complete",
      parcentage: 100,
      status: "completed",
      message: "Operation completed successfully",
      totalTime,
      result,
    });
    console.info(`🎉 Operation completed in ${totalTime}ms`);
  };
  const failStep = (stepId, error) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      step.status = "failed";
      step.error = error.message;

      emit({
        step: stepId,
        name: step.name,
        percentage: step.percentage,
        status: "failed",
        message: `Failed: ${step.name}`,
        error: error.message,
      });

      console.error(`❌ Step failed: ${step.name}`, error);
    }
  };
  const fail = (error) => {
    const totalTime = Date.now() - startTime;
    emit({
      step: "error",
      name: "error",
      parcentage: 0,
      status: "error",
      message: error.message,
      error: error.message,
      totalTime,
    });
    console.error(`💥 Operation failed after ${totalTime}ms`, error);
  };
  const getSummary = () => {
    const completed = steps.filter((s) => s.status === "completed").length;
    const total = steps.length;
    const overallPercentage =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      taskId: internalTaskId,
      totalSteps: total,
      completedSteps: completed,
      overallPercentage,
      currentStep: currentStep?.name || null,
      elapsedTime: Date.now() - startTime,
      steps: steps,
    };
  };
  return {
    onProgress,
    defineSteps,
    startStep,
    completeStep,
    failStep,
    updateProgress,
    complete,
    fail,
    getSummary,
    getTaskId: () => internalTaskId,
  };
};
