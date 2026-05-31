import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Executor {
  id: number;
  name: string;
  email: string;
  bankAccount: string;
}

export interface CreateExecutorRequest {
  name: string;
  email: string;
  bankAccount: string;
}

@Injectable({ providedIn: 'root' })
export class ExecutorsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/executors`;

  getAll(): Observable<Executor[]> {
    return this.http.get<Executor[]>(this.url);
  }

  create(request: CreateExecutorRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.url, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
