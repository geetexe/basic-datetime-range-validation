import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private fb:FormBuilder){}

  dateTime:{start:Date|null, end: Date|null} = {
    start: null, end: null
  }

  formattedDateTimeGroup = this.fb.group({
    startDateTime: [null],
    endDateTime: [null],
  }, {validators: this.validateDateTime()})
  
  dateTimeFormGroup = this.fb.group({
    start: this.fb.group({
      date: [''],
      time: this.fb.group({
        hours: [0],
        minutes: [0],
      }),
    }),
    end: this.fb.group({
      date: [''],
      time: this.fb.group({
        hours: [0],
        minutes: [0],
      })
    })
  });

  validateDateTime():ValidatorFn{
    return (control:AbstractControl):ValidationErrors|null => {
      let start:any = this.dateTimeFormGroup?.get(['start', 'date'])?.value;
      if(start){
        start = new Date(start);
        let hours = this.dateTimeFormGroup?.get(['start', 'time', 'hours'])?.value;
        if(hours || hours === 0){
          start.setHours(hours);
        }
        let minutes = this.dateTimeFormGroup?.get(['start', 'time', 'minutes'])?.value;
        if(minutes || minutes === 0){
          start.setMinutes(minutes);
        }
      }
      let end:any = this.dateTimeFormGroup?.get(['end', 'date'])?.value;
      if(end){
        end = new Date(end);
        let hours = this.dateTimeFormGroup?.get(['end', 'time', 'hours'])?.value;
        if(hours || hours === 0){
          end.setHours(hours);
        }
        let minutes = this.dateTimeFormGroup?.get(['end', 'time', 'minutes'])?.value;
        if(minutes || minutes === 0){
          end.setMinutes(minutes);
        }
      }
      debugger;
      if((start && end) && (start?.getTime() > end?.getTime())){
        return {'startGreaterThanEnd':true};
      }

      return null;
    }
  }


  ngOnInit(): void {
    this.dateTimeFormGroup.get(['start'])?.valueChanges.subscribe(
      startDateTime => {
        let {date, time} = startDateTime;
        let {hours, minutes} = time;
        let dateTime:any = new Date(date);
        dateTime.setHours(hours);
        dateTime.setMinutes(minutes);
        this.formattedDateTimeGroup.get('startDateTime')?.setValue(dateTime.toLocaleString());
        this.formattedDateTimeGroup.updateValueAndValidity();
      }
    );
    this.dateTimeFormGroup.get(['end'])?.valueChanges.subscribe(
      endDateTime => {
        let {date, time} = endDateTime;
        let {hours, minutes} = time;
        let dateTime:any = new Date(date);
        dateTime.setHours(hours);
        dateTime.setMinutes(minutes);
        this.formattedDateTimeGroup.get('endDateTime')?.setValue(dateTime.toLocaleString());
        this.formattedDateTimeGroup.updateValueAndValidity();
      }
    );

    this.formattedDateTimeGroup.valueChanges.subscribe(res => console.log(this.formattedDateTimeGroup.errors));
  }

  get dateTimeForm(){
    return this.formattedDateTimeGroup;
  }


}