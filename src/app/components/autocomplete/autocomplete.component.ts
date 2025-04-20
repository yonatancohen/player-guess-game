import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { UIPlayer } from '../../interfaces/player';
import { DecodeuUriPipe } from '../../pipes/decodeu-uri.pipe';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecodeuUriPipe,],
  templateUrl: './autocomplete.component.html',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: '0px' }),
        animate('300ms ease-out', style({ opacity: 1, maxHeight: '500px' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, maxHeight: '0px' }))
      ])
    ])
  ]
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() players: UIPlayer[] | undefined;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  searchControl = new FormControl('');
  filtered: UIPlayer[] = [];

  private subscription!: Subscription;

  ngOnInit(): void {
    if (!this.players) return;

    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      map(value => (value ? value.toLowerCase().trim() : '')),
      distinctUntilChanged(),
      map(searchText => {
        if (!this.players) return [];
        return searchText.length
          ? this.players.filter(p => !p.selected && p.name.toLowerCase().includes(searchText))
          : [];
      })
    ).subscribe(results => {
      this.filtered = results.sort((a: UIPlayer, b: UIPlayer) => a.name.localeCompare(b.name));
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  select(player: UIPlayer): void {
    this.searchControl.setValue('');
    this.filtered = [];

    this.selected.emit(player);
  }

  trackByPlayer(index: number, p: UIPlayer) {
    return p.id;
  }
}
