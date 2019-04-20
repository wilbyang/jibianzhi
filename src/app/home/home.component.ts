import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BackendApiService, Story} from '../services/backend-api.service';
import {distinctUntilChanged, switchMap, debounceTime, filter, map, tap} from 'rxjs/operators';
import {combineLatest, fromEvent, Observable} from 'rxjs';
import * as Fuse from 'fuse.js';

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
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'title',
      ]
    };

    const typeahead = (stories: Story[]) => fromEvent(this.input.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target.value),
      filter(text => text.length > 2),
      debounceTime(1000),
      distinctUntilChanged(),
      map((text) => {
        const fuse = new Fuse(stories, options);
        return fuse.search(text);
      })
    );
    this.backendApiService.getStories().pipe(
      switchMap((stories) => typeahead(stories)),
    ).subscribe((stories) => {
      this.stories = stories;
    });
  }

  ngOnInit() {

  }
}
