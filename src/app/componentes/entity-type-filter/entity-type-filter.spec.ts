import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTypeFilter } from './entity-type-filter';

describe('EntityTypeFilter', () => {
  let component: EntityTypeFilter;
  let fixture: ComponentFixture<EntityTypeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityTypeFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityTypeFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
