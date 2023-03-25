import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-list-common-filters',
  templateUrl: './list-common-filters.component.html',
  styleUrls: ['./list-common-filters.component.scss'],
})
export class ListCommonFiltersComponent implements OnInit {
  subject: Subject<any> = new Subject();
  searchText: string = '';
  SelectedFilter: string = '';

  @Output() onSearch = new EventEmitter<{ searchText: string }>();
  @Output() onRefreshEvent = new EventEmitter<{ event: any }>();
  @Output() onStatusFilter = new EventEmitter<{
    title: string;
    selectedValue: string;
  }>();
  @Input() latestSearchText?: string;
  constructor() {}

  ngOnInit(): void {
    this.subject.pipe(debounceTime(500)).subscribe(() => {
      this.onSearch.emit({ searchText: this.searchText });
    });
  }

  onUserKeyUp($event: any) {
    this.searchText = $event.target.value;
    this.subject.next(this.searchText);
  }

  onRefresh() {
    this.onRefreshEvent.emit();
  }

  onActiveSelectFilter(value: string) {
    let SelectedValue: string = '';
    if (value === 'All') this.SelectedFilter = '';
    else if (value === 'active') {
      this.SelectedFilter = 'Active';
      SelectedValue = 'true';
    } else if (value === 'inactive') {
      this.SelectedFilter = 'In Active';
      SelectedValue = 'false';
    }
    this.onStatusFilter.emit({ title: 'IsActive', selectedValue: SelectedValue });
  }
}
