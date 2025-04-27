import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { DecodeuUriPipe } from '../../pipes/decodeu-uri.pipe';
import { Player } from '../../interfaces/models';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecodeuUriPipe, ScrollingModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
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
export class AutocompleteComponent implements OnInit, OnDestroy, OnChanges {
  @Input() players: Player[] | undefined;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Input() gameCompleted: boolean = false;
  @Input() showSelectedText: boolean = false;
  @Input() isSearchMode: boolean = false;

  searchControl = new FormControl('');
  filtered: Player[] = [];

  private subscription!: Subscription;

  constructor(private adminService: AdminService) {

  }

  ngOnInit(): void {
    if (!this.isSearchMode) {
      this.subscription = this.searchControl.valueChanges.pipe(
        debounceTime(700),
        map(value => (value ? value.toLowerCase().trim() : '')),
        distinctUntilChanged(),
        map(searchText => {
          if (!this.players) return [];
          return searchText.length
            ? this.players.filter(p => p.name.toLowerCase().includes(searchText))
            : [];
        })
      ).subscribe(results => {
        this.filtered = results.sort((a: Player, b: Player) => a.name.localeCompare(b.name));
      });
    }
    else {
      this.subscription = this.searchControl.valueChanges.pipe(
        debounceTime(300),
        map(value => value ? value.toLowerCase().trim() : ''),
        distinctUntilChanged(),
        switchMap(searchText => {
          if (!searchText.length) {
            return of([]); // תחזיר מערך ריק אם אין טקסט
          }
          return this.adminService.searchPlayers(searchText);
        })
      ).subscribe(results => {
        this.filtered = results.sort((a: Player, b: Player) => a.name.localeCompare(b.name));
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameCompleted']) {
      if (changes['gameCompleted'].currentValue) {
        this.searchControl.disable();
      }
      else {
        this.searchControl.enable();
      }
    }
  }

  select(player: Player): void {
    this.searchControl.setValue('');
    if (this.showSelectedText) {
      this.searchControl.setValue(player.name, { emitEvent: false });
    }

    this.filtered = [];

    this.selected.emit(player);
  }

  resetSelection() {
    this.searchControl.setValue('');
    this.selected.emit(null);
  }

  trackByPlayer(index: number, p: Player) {
    return p.id;
  }
}
