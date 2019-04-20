import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BackendApiService, Story} from '../services/backend-api.service';
import {distinctUntilChanged, switchMap, debounceTime, filter, map, startWith} from 'rxjs/operators';
import {from, fromEvent, of} from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <input placeholder="search" #searchInput autocomplete="off"/>
    <h2 *ngFor="let story of stories">
      {{story.title | uppercase}}
    </h2>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  stories: Story[];
  @ViewChild('searchInput')
  input: ElementRef;

  constructor(private backendApiService: BackendApiService) {
  }
  ngAfterViewInit(): void {

    const typeahead = fromEvent(this.input.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target.value),
      filter(text => text.length > 2),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(() => this.backendApiService.getStories())
    );

    typeahead.subscribe((data) => {
      this.stories = data;
    });
  }

  ngOnInit() {
    this.backendApiService.getStories().subscribe((stories) => {
      this.stories = stories;
    });
  }
}
