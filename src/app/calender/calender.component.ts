import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalenderService } from './calender-service';
import { CalendarEvent } from './calendar-events-model';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth-service';


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
  userId: string;
  isEditMode = false;
  eventId: string;
  userName: string;
  constructor(config: NgbModalConfig, private modalService: NgbModal, private toaster: ToastrService,
              private calenderService: CalenderService, private route: ActivatedRoute,
              private authService: AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.userId = this.route.snapshot.params['uid'];
    if (this.userId) {
      this.toaster.info('Click on any date to add events..', 'Notify!');
      this.getEvents();
    }
  }

  changeComplete($event) {
    this.backgroundColorNoteTextArea = ($event.color.hex);
  }

  handleDateClick(arg, content) {
    this.isEditMode = false;
    this.selectedDate = arg.dateStr;
    this.Note = '';
    this.backgroundColorNoteTextArea = '#ffffff';
    this.eventId = '';
    this.authService.getCurrentUserFromDB(this.userId).subscribe(response => {
      this.userName = response.name;
      this.modalService.open(content);
    });
  }

  handleEventClick(arg, content) {
    this.isEditMode = true;
    this.selectedDate = arg.event.start;
    this.Note = arg.event.title;
    this.eventId = arg.event.id;
    this.backgroundColorNoteTextArea = arg.event.backgroundColor;
    this.authService.getCurrentUserFromDB(this.userId).subscribe(response => {
      this.userName = response.name;
      this.modalService.open(content);
    });
  }
  Save() {
    if (this.isEditMode) {
      this.calenderService.
        updateCalenderNote(this.userId, this.eventId, this.Note, this.backgroundColorNoteTextArea)
        .then(res => {
          console.log(this.eventId);
          const calendarEvents = this.calendarEvents.slice();
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < calendarEvents.length; index++) {
            if (calendarEvents[index].id === this.eventId) {
              calendarEvents[index].color = this.backgroundColorNoteTextArea;
              calendarEvents[index].title = this.Note;
            }
          }
          this.calendarEvents = calendarEvents;
          this.modalService.dismissAll();
          this.isEditMode = !this.isEditMode;
          this.toaster.success('event updated', 'Notify!');
        }).catch(err => console.log(err));
    } else {
      const currentTimeStamp = Date.now().toString();
      this.calenderService.saveCalenderNoteInDb(this.userId, this.Note,currentTimeStamp,
        this.selectedDate, this.backgroundColorNoteTextArea, new Date().toISOString())
        .then(res => {
          this.calendarEvents = this.calendarEvents.concat({
            title: this.Note,
            date: this.selectedDate,
            color: this.backgroundColorNoteTextArea,
            id: currentTimeStamp
          });
          this.isEditMode = !this.isEditMode;
          this.modalService.dismissAll();
          this.toaster.success('new event added', 'Notify!');
        }).catch(err => console.log(err));
    }
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
              color: event.noteColor,
              id: event.id
            });
          }
        }
      });
  }
}
