import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Player } from '../../../interfaces/models';
import { AdminService } from '../../../services/admin.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteComponent } from "../../autocomplete/autocomplete.component";
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, AutocompleteComponent, AdminMenuComponent]
})
export class EditPlayerComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  @ViewChild(AutocompleteComponent) autoCompleteComponent!: AutocompleteComponent;

  countries: Array<Country> = [];
  selectedPlayer: Player | undefined;
  submitting: boolean = false;

  environment = environment;

  playerForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.playerForm = this.fb.group({
      first_name_he: [null, [Validators.required, Validators.minLength(2)]],
      last_name_he: [null, [Validators.required, Validators.minLength(2)]],
      display_name_he: [null, [Validators.required, Validators.minLength(2)]],
      nationality_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.subs.add(this.adminService.getCountries().subscribe(countries => this.countries = countries));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async onPlayerSelected(player: Player) {
    this.selectedPlayer = player;

    const playerInfo = await lastValueFrom(this.adminService.getPlayer(player.id));
    this.playerForm.patchValue(playerInfo);
  }

  getFormControlError(controlName: string): string {
    const control = this.playerForm.get(controlName);
    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control?.errors?.['required']) {
        return 'שדה חובה';
      }
      if (control?.errors?.['minlength']) {
        return 'מינימום 2 תווים';
      }
      if (control?.errors?.['min']) {
        return 'מספר חיובי בלבד';
      }
      if (control?.errors?.['max']) {
        return 'מספר עד 99';
      }
    }
    return '';
  }

  onSubmit() {
    this.playerForm.markAllAsTouched();

    if (this.playerForm.valid && this.selectedPlayer) {
      this.submitting = true;
      const formData = this.playerForm.value;
      
      this.adminService.updatePlayer(this.selectedPlayer.id, formData).subscribe({
        next: () => {
          this.submitting = false;
          this.toastrService.success('השחקן עודכן בהצלחה');
          
          this.playerForm.reset();
          this.playerForm.markAsPristine();
          this.playerForm.markAsUntouched();
          this.playerForm.updateValueAndValidity();
          
          this.autoCompleteComponent.resetSelection();
          this.selectedPlayer = undefined;
        },
        error: () => {
          this.submitting = false;
          this.toastrService.error('שגיאה בעדכון השחקן');
        }
      });
    }
  }
} 