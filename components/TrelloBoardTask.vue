<script setup lang="ts">
import type { Task, ID } from "~/types";

// Define props
const props = defineProps<{
  task: Task;
}>();

// Define Emit
const emit = defineEmits<{
  (e: "delete", payload: ID): void;
}>();

// Define refs
const focused = ref(false);
onKeyStroke("Backspace", (e) => {
  if (focused.value) emit("delete", props.task.id);
});
</script>
<template>
  <div
    :title="task.createdAt.toLocaleString()"
    class="task bg-white p-2 mb-2 rounded shadow-md max-w-[250px] flex items-center gap-2 cursor-pointer"
    @focus="focused = true"
    @blur="focused = false"
    tabindex="0"
  >
    <DragHandle />
    {{ task.title }}
    {{
      typeof task.createdAt === "string"
        ? task.createdAt
        : task.createdAt.toLocaleString("en-US", {
            timeStyle: "short",
            dateStyle: "short",
          })
    }}
  </div>
</template>

<style>
.sortable-drag .task {
  transform: rotate(5deg);
}
.sortable-ghost .task {
  position: relative;
}

.sortable-ghost .task::after {
  content: "";
  @apply absolute top-0 bottom-0 left-0 right-0 bg-slate-200 rounded;
}

.task:focus,
.task:focus-visible {
  @apply outline-green-900 !important;
  outline: gray auto 1px;
}
</style>
