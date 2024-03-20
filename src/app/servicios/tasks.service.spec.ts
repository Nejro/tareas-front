import { TestBed } from '@angular/core/testing';

import { tasksService} from './tasks.service';

describe('TasksService', () => {
  let service: tasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
