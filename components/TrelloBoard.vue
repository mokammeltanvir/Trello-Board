<script setup lang="ts">
import type { Column, Task } from "~/types";
import draggable from "vuedraggable";
import { nanoid } from "nanoid";

const columns = useLocalStorage<Column[]>(
  "trelloBoard",
  [
    {
      title: "Create a Vue 3 Project",
      id: nanoid(),
      tasks: [
        {
          title: "Create a new project",
          createdAt: new Date(),
          id: nanoid(),
        },
        {
          title: "Develop cool new feature",
          createdAt: new Date(),
          id: nanoid(),
        },
        {
          title: "Fix the bug",
          createdAt: new Date(),
          id: nanoid(),
        },
        {
          title: "Refactor the code",
          createdAt: new Date(),
          id: nanoid(),
        },
      ],
    },
    {
      title: "Selected for Development",
      id: nanoid(),
      tasks: [],
    },
    {
      title: "In Progress",
      id: nanoid(),
      tasks: [],
    },
    {
      title: "QA",
      id: nanoid(),
      tasks: [],
    },
    {
      title: "Completed",
      id: nanoid(),
      tasks: [],
    },
  ],
  {
    serializer: {
      read: (value) => {
        return JSON.parse(value).map((column: Column) => {
          column.tasks = column.tasks.map((task: Task) => {
            task.createdAt = new Date(task.createdAt);
            return task;
          });
          return column;
        });
      },
      write: (value) => JSON.stringify(value),
    },
  }
);
const alt = useKeyModifier("Alt");

watch(
  columns,
  () => {
    //ajax request to save the data
    // localStorage.setItem("trelloBoard", JSON.stringify(columns.value));
  },
  { deep: true }
);

function createColumn() {
  const column: Column = {
    id: nanoid(),
    title: "",
    tasks: [],
  };
  columns.value.push(column);
  nextTick(() => {
    (
      document.querySelector(
        ".column:last-of-type .title-input"
      ) as HTMLInputElement
    ).focus();
  });
}
</script>
<template>
  <div class="flex items-start overflow-x-auto gap-4">
    <draggable
      v-model="columns"
      group="columns"
      :animation="200"
      handle=".drag-handle"
      item-key="id"
      class="flex gap-4 overflow-x-auto items-start"
    >
      <template #item="{ element: column }: { element: Column }">
        <div class="bg-green-100 p-5 rounded min-w-[250px]">
          <header>
            <div class="text-lg font-semibold p-2 mb-2 flex">
              <DragHandle />
              <input
                class="bg-transparent focus:bg-white rounded px-1 w-full capitalize title-input"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @keydown.backspace="
                  column.title === ''
                    ? (columns = columns.filter((c) => c.id !== column.id))
                    : null
                "
                type="text"
                v-model="column.title"
              />
            </div>
          </header>

          <draggable
            v-model="column.tasks"
            :group="{ name: 'tasks', pull: alt ? 'clone' : true }"
            :animation="150"
            handle=".drag-handle"
            item-key="id"
          >
            <template #item="{ element: task }: { element: Task }">
              <div>
                <TrelloBoardTask
                  :task="task"
                  @delete="
                    column.tasks = column.tasks.filter((t) => t.id !== $event)
                  "
                />
              </div>
            </template>
          </draggable>

          <footer>
            <NewTask @add="column.tasks.push($event)" />
          </footer>
        </div>
      </template>
    </draggable>
    <button
      @click="createColumn"
      class="bg-green-200 whitespace-nowrap p-2 rounded opacity-50"
    >
      + Add Another Column
    </button>
  </div>
</template>
