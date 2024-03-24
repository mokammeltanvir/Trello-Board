type ID = string | number;
interface Column {
  id: ID;
  title: string;
  tasks: Task[];
}

interface Task {
  id: ID;
  title: string;
  createdAt: Date;
}
