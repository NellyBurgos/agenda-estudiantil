import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskComponent } from './add-task';

describe('AddTask', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
