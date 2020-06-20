import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalenderService } from './calender-service';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class CalenderComponent implements OnInit {


  calendarPlugins = [dayGridPlugin, interactionPlugin, timeGridPlugin];
  calendarEvents = [];
  selectedDate: string;
  Note: string;
  backgroundColorNoteTextArea = '#ffffff';

  constructor(config: NgbModalConfig, private modalService: NgbModal,
              private calenderService: CalenderService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    console.log(this.calendarEvents);
    this.getEvents();
  }

  changeComplete($event) {
    this.backgroundColorNoteTextArea = ($event.color.hex);
  }


  handleDateClick(arg, content) {
    this.selectedDate = arg.dateStr;
    this.Note = '';
    this.modalService.open(content);
  }

  open(content) {
    this.modalService.open(content);
  }

  Save() {
    this.calenderService
      .saveCalenderNoteInDb('gjdK0FSLe8aWv6SO83f0ZhvrFUO2', this.Note,
        this.selectedDate, 'Black', new Date().toISOString())
      .then(res => {
        this.modalService.dismissAll();
      }).catch(err => console.log(err));
  }

  getEvents() {
    this.calenderService.getAllCalenderNotes('gjdK0FSLe8aWv6SO83f0ZhvrFUO2')
      .subscribe(res => {
        for (const key in res) {
          var event = res[key];
          this.calendarEvents = this.calendarEvents.concat({
            title: event.note,
            date: event.noteDate,
            color: event.noteColor
          })
        }
        console.log(this.calendarEvents);
      });
  }
}
