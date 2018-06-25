import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Color } from "tns-core-modules/color";

@Component({
    selector: "FloatLabel",
    moduleId: module.id,
    templateUrl: "./float-label.html",
    styleUrls: ["./float-label.css"]
})
export class FloatLabel {
    @Input() placeholder: string;
    @Input() secure: boolean;
    @ViewChild("label") label: ElementRef;
    @ViewChild("textField") textField: ElementRef;

    constructor() {
    }

    ngOnInit(): void {
    }

    onFocus() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // animate the label sliding up and less transparent.
        label.animate({
            translate: { x: 0, y: - 25 },
            opacity: 1,
        }).then(() => { }, () => { });

        // set the border bottom color to green to indicate focus
        textField.borderBottomColor = new Color('#FA9FAF');
    }

    onBlur() {
        const label = this.label.nativeElement;
        const textField = this.textField.nativeElement;

        // if there is text in our input then don't move the label back to its initial position.
        if (!textField.text) {
            label.animate({
                translate: { x: 0, y: 0 },
                opacity: 0.4
            }).then(() => { }, () => { });
        }
        // reset border bottom color.
        textField.borderBottomColor = new Color('#FA9FAF');
    }
}
