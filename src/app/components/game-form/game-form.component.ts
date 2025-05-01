import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { AdminService } from '../../services/admin.service';
import { debounceTime, distinctUntilChanged, lastValueFrom, Observable, of, Subject, Subscription, switchMap } from 'rxjs';
import { League, Player } from '../../interfaces/models';
import { PlayerService } from '../../services/player.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent, ReactiveFormsModule],
})
export class GameFormComponent implements OnInit, OnDestroy {
  @ViewChild(AutocompleteComponent) autoCompleteComponent!: AutocompleteComponent;

  leagues: Array<League> = [];
  players: Array<Player> = [];
  gameForm: FormGroup;
  submitting: boolean = false;
  isEditMode: boolean = false;

  private selectedLeagues$ = new Subject<League[]>();
  private subs = new Subscription();
  selectionMap = new Map<number, boolean>();

  constructor(
    private adminService: AdminService,
    private playerService: PlayerService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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

    // Check if we're in edit mode
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.isEditMode = true;
      this.loadGameData(parseInt(gameId));
    }
  }

  private loadGameData(gameId: number) {
    this.subs.add(
      this.adminService.getGame(gameId).subscribe(admin_game => {
        // Set form values
        const date = admin_game.game.activate_at.split(' ')[0];
        const time = new Date(admin_game.game.activate_at).toLocaleTimeString('he-IL', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jerusalem'
        });

        this.gameForm.patchValue({
          player: admin_game.game.player_id,
          gameDate: date,
          gameTime: time,
          hint: admin_game.game.hint
        });

        this.autoCompleteComponent.select({ id: admin_game.game.player_id, name: admin_game.game.player_name } as Player)

        // Set leagues
        admin_game.leagues.forEach(league => {
          this.selectionMap.set(league.id, true);
        });
        const selected = this.leagues.filter(l => this.selectionMap.has(l.id));
        this.selectedLeagues$.next(selected);

        this.gameForm.patchValue({ leagues: selected.map(l => l.id) });
      })
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
      const datetime = moment(this.gameForm.value.gameDate + ' ' + this.gameForm.value.gameTime).format('YYYY-MM-DD HH:mm:ss');

      const gameId = this.route.snapshot.paramMap.get('id');
      const request$ = gameId
        ? this.adminService.updateGame(
          parseInt(gameId),
          this.gameForm.value.player,
          datetime,
          this.gameForm.value.leagues,
          this.gameForm.value.hint
        )
        : this.adminService.createGame(
          this.gameForm.value.player,
          datetime,
          this.gameForm.value.leagues,
          this.gameForm.value.hint
        );

      request$.subscribe({
        next: () => {
          this.submitting = false;
          this.toastrService.success(this.isEditMode ? 'המשחק עודכן בהצלחה' : 'המשחק נוצר בהצלחה');

          if (!this.isEditMode) {
            this.gameForm.reset();
            this.gameForm.markAsPristine();
            this.gameForm.markAsUntouched();
            this.gameForm.updateValueAndValidity();
            this.selectionMap.clear();
            this.autoCompleteComponent.resetSelection();
          }
        },
        error: () => {
          this.submitting = false;
          this.toastrService.error(this.isEditMode ? 'שגיאה בעדכון המשחק' : 'שגיאה בעת יצירת משחק');
        }
      });
    }
  }

  back() {
    this.router.navigate([`/${environment.adminPath}games`]);
  }
} 