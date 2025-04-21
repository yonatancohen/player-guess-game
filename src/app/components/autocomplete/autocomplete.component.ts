import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { DecodeuUriPipe } from '../../pipes/decodeu-uri.pipe';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../interfaces/player';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
export class AutocompleteComponent implements OnInit, OnDestroy {
  players: Player[] | undefined;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  searchControl = new FormControl('');
  filtered: Player[] = [];

  private subscription!: Subscription;

  constructor(private playersService: PlayerService) {

  }

  ngOnInit(): void {
    this.playersService.getAllPlayers().subscribe(response => this.players = response);

    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  select(player: Player): void {
    this.searchControl.setValue('');
    this.filtered = [];

    this.selected.emit(player);
  }

  trackByPlayer(index: number, p: Player) {
    return p.id;
  }
}
