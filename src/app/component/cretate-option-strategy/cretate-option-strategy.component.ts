import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, OptionStrategyService } from '../../services';
import { CustomMap } from 'src/app/helpers';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cretate-option-strategy',
  templateUrl: './cretate-option-strategy.component.html',
  styleUrls: ['./cretate-option-strategy.component.scss']
})
export class CretateOptionStrategyComponent {
  
  constructor(private optionStrategyService: OptionStrategyService, private authService: AuthenticationService, private formBuilder: FormBuilder) {

  }

  faPlus = faPlusCircle;
  optionCreateForm: FormGroup | undefined;
  positions = new CustomMap<string, any>();
  formErr: any = null;
  submitted = false;

  ngOnInit() {
    this.authService.checkActiveLogin().subscribe();
    this.optionCreateForm = this.formBuilder.group({
      parent: '', ticker: ['', Validators.required], stock_price: ['', Validators.required],
      risk_free_rate: ['', Validators.required], days_from_today: ['', Validators.required], interval: ['', Validators.required],
      start_date: ['', Validators.required], cash: '', active: ['', Validators.required], cash_in_hand: '',
      parentTradeCost: '', extra_cash: ''
    });
  }

  addNewPosition() {
    const key = this.makeid(5);
    this.positions.set(key, { row_id: key });
  }

  
  makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  removePosition(rowId: string) {
    this.positions.delete(rowId);
  }

  get f() { return this.optionCreateForm?.controls; }

  calculateOptStrategy() {
    console.log('opoppopo')
    this.submitted = true;
    if (this.optionCreateForm?.invalid) {
      return;
    }
    if (this.positions.getEntries().length == 0) {
      this.formErr = 'At one position is required! ';
      return;
    }
    let formData = this.optionCreateForm?.value;

    formData.positions = this.positions.getEntries();
    console.log('form data : ',formData)
    this.optionStrategyService.analyserCalc(formData).subscribe((resp: any) => {
      console.log(resp)
    })
  }

}
