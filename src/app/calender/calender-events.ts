import { Component, OnInit  } from '@angular/core';

@Component({
    selector: 'app-calender-events',
    template: `<div class="mx-auto">
    <div class="text-center">
        <p></p>
    </div>
    <form>
        <div class="form-row">
            <div class="col">
                <input type="text" name="email"
                readonly class="form-control" title="User Email">
            </div>
        </div>
    </form>
</div>`
})

export class CalenderEventsComponent implements OnInit {
    ngOnInit() {
    }
}
