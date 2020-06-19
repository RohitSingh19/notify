import { Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import CalendarComponent from '@fullcalendar/core/CalendarComponent';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  calendarPlugins = [dayGridPlugin]; // important!
  constructor() { }

  ngOnInit() {
    
  }

}
