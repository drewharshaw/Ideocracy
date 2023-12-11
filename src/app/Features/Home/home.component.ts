import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

enum AnimationState {
    transparent = 'transparent',
    solid = 'solid'
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('fade', [
            state('transparent', style({
                background: 'transparent',
                color: 'white'
            })),
            state('solid', style({
                background: '#006ea7',
                'border-bottom': 'rgba(0,0,0,.15)',
                color: 'white',
            })),
            transition('transparent => solid', [
                style({ background: 'transparent' }),
                animate(500, style({ background: '#006ea7'}))
            ]),
            transition('solid => transparent', [
                style({ background: '#006ea7' }),
                animate(600, style({ background: 'transparent'}))
            ])
        ])
    ]
})
export class HomeComponent {

    @ViewChild('navbarRef') navbarRef: ElementRef;

    @HostListener('window:scroll', ['$event']) onScroll() {
        this.navAnimateState = (window.scrollY < 200) ? AnimationState.transparent : AnimationState.solid;
    }

    navAnimateState: AnimationState = AnimationState.transparent;
    termsVisible = false;
    privacyVisible = false;

    readonly animationState = AnimationState;
    readonly year = new Date().getFullYear();

    constructor() {}
}
