import { animate, state, style, transition, trigger } from "@angular/animations";
export const tharwaAnimations = [trigger("from-bottom", [
    state("in", style({
        "opacity": 1,
        transform: "translateY(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translateY(20%)"
    })),
    transition("void => *", [animate("1600ms 700ms ease-out")]),
    transition("* => void", [animate("600ms ease-in")])
]),
trigger("fade-in", [
    state("in", style({
        "opacity": 1
    })),
    state("void", style({
        "opacity": 0
    })),
    transition("void => *", [animate("800ms 2000ms ease-out")])
]),
trigger("scale-in", [
    state("in", style({
        "opacity": 1,
        transform: "scale(1)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "scale(0.9)"
    })),
    transition("void => *", [animate("1100ms ease-out")])
]),
trigger("flyInOut", [
    state("in", style({ transform: "scale(1)", opacity: 1 })),
    transition("void => *", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("1000ms 100ms ease-out")
    ])
]),
trigger("from-right", [
    state("in", style({
        "opacity": 1,
        transform: "translate(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translate(20%)"
    })),
    transition("void => *", [animate("600ms 1500ms ease-out")])
]),
trigger("from-bottom", [
    state("in", style({
        "opacity": 1,
        transform: "translateY(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translateY(20%)"
    })),
    transition("void => *", [animate("1600ms 700ms ease-out")])
]),
trigger("fade-in", [
    state("in", style({
        "opacity": 1
    })),
    state("void", style({
        "opacity": 0
    })),
    transition("void => *", [animate("800ms 2000ms ease-out")])
]),
trigger("scale-in", [
    state("in", style({
        "opacity": 1,
        transform: "scale(1)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "scale(0.9)"
    })),
    transition("void => *", [animate("1100ms ease-out")])
]),
trigger("from-right", [
    state("in", style({
        "opacity": 1,
        transform: "translate(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translate(20%)"
    })),
    transition("void => *", [animate("600ms 1500ms ease-out")])
]),
trigger("state", [
    state("in", style({
        "opacity": 1,
        transform: "scale(1)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "scale(0.8)"
    })),
    transition("void => *", [animate("1300ms ease-out")])
]),
trigger("plugincountstate", [
    state("in", style({
        "opacity": 1,
        transform: "scale(1) rotate(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "scale(0) rotate(-1300)"
    })),
    // "after a delay of 1000ms, show an animation with a duration of 2300ms"
    transition("void => *", [animate("2300ms 1000ms ease-out")])
]),
trigger("fade-in", [
    state("in", style({
        "opacity": 1
    })),
    state("void", style({
        "opacity": 0
    })),
    transition("void => *", [animate("1600ms 3200ms ease-out")])
]),
trigger("from-bottom", [
    state("in", style({
        "opacity": 1,
        transform: "translateY(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translateY(20%)"
    })),
    transition("void => *", [animate("1600ms 700ms ease-out")]),
    transition("* => void", [animate("600ms ease-in")])
]),
trigger("fade-in", [
    state("in", style({
        "opacity": 1
    })),
    state("void", style({
        "opacity": 0
    })),
    transition("void => *", [animate("800ms 2000ms ease-out")])
]),
trigger("scale-in", [
    state("in", style({
        "opacity": 1,
        transform: "scale(1)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "scale(0.9)"
    })),
    transition("void => *", [animate("1100ms ease-out")])
]),
trigger("flyInOut", [
    state("in", style({ transform: "scale(1)", opacity: 1 })),
    transition("void => *", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("1000ms 100ms ease-out")
    ])
]),
trigger("from-right", [
    state("in", style({
        "opacity": 1,
        transform: "translate(0)"
    })),
    state("void", style({
        "opacity": 0,
        transform: "translate(20%)"
    })),
    transition("void => *", [animate("600ms 1500ms ease-out")])
])
];