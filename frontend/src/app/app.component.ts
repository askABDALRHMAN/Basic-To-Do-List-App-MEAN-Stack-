import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);

  todos: Todo[] = [];
  newTodoText = '';
  errorMessage = '';
  isLoading = false;
  isAdding = false;

  ngOnInit(): void {
    this.loadTodos();
  }

  addTodo(): void {
    const text = this.newTodoText.trim();
    if (!text || this.isAdding) {
      return;
    }

    this.errorMessage = '';
    this.isAdding = true;
    this.http.post<Todo>('/api/todos', { text }).subscribe({
      next: (todo) => {
        this.todos = [...this.todos, todo];
        this.newTodoText = '';
        this.isAdding = false;
      },
      error: () => {
        this.errorMessage = 'Unable to add the to-do item. Please try again.';
        this.isAdding = false;
      }
    });
  }

  private loadTodos(): void {
    this.isLoading = true;
    this.http.get<Todo[]>('/api/todos').subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load to-do items. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
