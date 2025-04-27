import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { AdminService } from '../../services/admin.service';
import { debounceTime, distinctUntilChanged, lastValueFrom, Observable, of, Subject, Subscription, switchMap } from 'rxjs';
import { League, Player } from '../../interfaces/models';
import { PlayerService } from '../../services/player.service';
import { GameService } from '../../services/game.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent, ReactiveFormsModule],
})
export class CreateGameComponent implements OnInit, OnDestroy {
  @ViewChild(AutocompleteComponent) autoCompleteComponent!: AutocompleteComponent;

  leagues: Array<League> = [];
  players: Array<Player> = [];

  gameForm: FormGroup;
  submitting: boolean = false;

  private selectedLeagues$ = new Subject<League[]>();
  private subs = new Subscription();
  selectionMap = new Map<number, boolean>();

  constructor(private adminService: AdminService,
    private playerService: PlayerService,
    private gameService: GameService,
    private fb: FormBuilder,
    private toastrService: ToastrService) {
    this.gameForm = this.fb.group({
      leagues: [[], Validators.required],
      player: ['', Validators.required],
      gameDate: ['', Validators.required],
      gameTime: ['', Validators.required],
      hint: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subs.add(this.adminService.getLeagues().subscribe(leagues => this.leagues = leagues));

    this.subs.add(
      this.selectedLeagues$.pipe(
        debounceTime(1000),
        distinctUntilChanged((a, b) =>
          a.length === b.length &&
          a.map(l => l.id).sort().join(',') === b.map(l => l.id).sort().join(',')
        ),
        switchMap((selected) => {
          if (selected.length === 0) {
            return of([]);
          }

          const ids = selected.map(l => l.id);
          return this.playerService.getPlayersByLeagues(ids);
        })
      ).subscribe(players => this.players = players)
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isSelected(league: League): boolean {
    return this.selectionMap.has(league.id);
  }

  toggleLeague(league: League) {
    if (this.selectionMap.has(league.id)) {
      this.selectionMap.delete(league.id);
    } else {
      this.selectionMap.set(league.id, true);
    }
    const selected = this.leagues.filter(l => this.selectionMap.has(l.id));
    this.selectedLeagues$.next(selected);

    this.gameForm.patchValue({ leagues: selected.map(l => l.id) });
  }

  onPlayerSelected(player: Player) {
    this.gameForm.patchValue({ player: player?.id });
  }

  getFormControlError(controlName: string): string {
    const control = this.gameForm.get(controlName);
    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control?.errors?.['required']) {
        return 'שדה חובה';
      }
    }
    return '';
  }

  onSubmit(): void {
    this.gameForm.markAllAsTouched();

    if (this.gameForm.valid) {
      this.submitting = true;
      const datetime = new Date(this.gameForm.value.gameDate + ' ' + this.gameForm.value.gameTime).toJSON();
      this.adminService.createGame(this.gameForm.value.player, datetime, this.gameForm.value.leagues, this.gameForm.value.hint).subscribe({
        next: () => {
          this.submitting = false;
          this.toastrService.success('המשחק נוצר בהצלחה');

          this.gameForm.reset();
          this.gameForm.markAsPristine();
          this.gameForm.markAsUntouched();
          this.gameForm.updateValueAndValidity();

          this.selectionMap.clear();

          this.autoCompleteComponent.resetSelection();
        },
        error: () => {
          this.submitting = false;
          this.toastrService.error('שגיאה בעת יצירת משחק');
        }
      });
    }
  }
} 