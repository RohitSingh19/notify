import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalenderService } from './calender-service';
import { CalendarEvent } from './calendar-events-model';


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
  backgroundColorNoteTextArea: string;
  userId = 'gjdK0FSLe8aWv6SO83f0ZhvrFUO2';

  constructor(config: NgbModalConfig, private modalService: NgbModal,
                      private calenderService: CalenderService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.getEvents();
  }

  changeComplete($event) {
    this.backgroundColorNoteTextArea = ($event.color.hex);
  }

  handleDateClick(arg, content) {
    this.selectedDate = arg.dateStr;
    this.Note = '';
    this.backgroundColorNoteTextArea = '#ffffff';
    this.modalService.open(content);
  }

  open(content) {
    this.modalService.open(content);
  }

  Save() {
    this.calenderService.saveCalenderNoteInDb(this.userId, this.Note,
        this.selectedDate, this.backgroundColorNoteTextArea, new Date().toISOString())
      .then(res => {
        this.calendarEvents = this.calendarEvents.concat({
          title: this.Note,
          date: this.selectedDate,
          color: this.backgroundColorNoteTextArea
        });
        this.modalService.dismissAll();
      }).catch(err => console.log(err));
  }

  getEvents() {
    this.calenderService.getAllCalenderNotes(this.userId)
      .subscribe((res: CalendarEvent[]) => {
        // tslint:disable-next-line: forin
        for (const key in res) {
            const event = res[key];
            if (event) {
              this.calendarEvents = this.calendarEvents.concat({
                title: event.note,
                date: event.noteDate,
                color: event.noteColor
              });
            }
          }
      });
  }
}
