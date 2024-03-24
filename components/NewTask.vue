<script setup lang="ts">
import type { Task } from "~/types";
import { nanoid } from "nanoid";

const emit = defineEmits<{
  (e: "add", payload: Task): void;
}>();

const focused = ref(false);
const title = ref("");

function addTask(e: Event) {
  if (title.value.trim()) {
    e.preventDefault();
    emit("add", {
      title: title.value.trim(),
      createdAt: new Date(),
      id: nanoid(),
    } as Task);

    title.value = ""; // Reset the title after emitting the event
  }
}
</script>

<template>
  <div>
    <textarea
      v-model="title"
      @keydown.tab="addTask"
      @keyup.enter="addTask"
      class="focus:bg-white focus:shadow resize-none w-full border rounded transition-shadow duration-200"
      :class="{
        'h-7 bg-green-100': !focused,
        'h-20': focused,
      }"
      style="outline: none !important"
      @focus="focused = true"
      @blur="focused = false"
      :placeholder="!focused ? '+ Add a task' : 'Enter a title for this task'"
    >
    </textarea>
  </div>
</template>
