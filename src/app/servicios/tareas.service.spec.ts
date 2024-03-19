import { TestBed } from '@angular/core/testing';

import { tareasService} from './tareas.service';

describe('TareasService', () => {
  let service: tareasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tareasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
