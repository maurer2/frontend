enum Direction {
    next = 'left',
    previous = 'right',
}

class BaseGallery {
    private slides: Array<HTMLElement>;
    private linkNextSlide: HTMLLinkElement;
    private linkPreviousSlide: HTMLLinkElement;
    private counter: HTMLElement;

    public constructor(private domNode: HTMLElement) {
        const slidesList = this.domNode.querySelectorAll('.gallery_slide') as NodeListOf<HTMLElement>;
        this.slides = Array.prototype.slice.call(slidesList);
        this.linkNextSlide = this.domNode.querySelector('.gallery_next') as HTMLLinkElement;
        this.linkPreviousSlide = this.domNode.querySelector('.gallery_prev') as HTMLLinkElement;
        this.counter = this.domNode.querySelector('.gallery_counter') as HTMLElement;

        this.updateCounter();
        this.registerEvents();
    }

    private registerEvents(): void {
        this.linkNextSlide.addEventListener('click', (event: Event) => this.switchSlides(Direction.next));
        this.linkPreviousSlide.addEventListener('click', (event: Event) => this.switchSlides(Direction.previous));
    }

    private switchSlides(direction = Direction.next): void {
        const activeSlide: HTMLElement = this.slides.find((element: HTMLElement) => {
            return element.classList.contains('gallery_slide--is-current');
        });
        let newSlide: HTMLElement = this.slides[this.slides.indexOf(activeSlide) + 1];

        if (direction === Direction.previous) {
            newSlide = this.slides[this.slides.indexOf(activeSlide) - 1];
        }

        if (newSlide === undefined) {
            return;
        }

        // step 1
        newSlide.classList.add('gallery_slide--is-following');
        newSlide.classList.add(direction === Direction.next ?
        'gallery_slide--is-out-of-right-bound' : 'gallery_slide--is-out-of-left-bound');

        // Force reflow to stop browsers combining step 1 and step 2
        this.domNode.getBoundingClientRect();

        // step 2
        activeSlide.classList.add(direction === Direction.next ?
            'gallery_slide--is-out-of-left-bound' : 'gallery_slide--is-out-of-right-bound');
        newSlide.classList.remove('gallery_slide--is-out-of-left-bound', 'gallery_slide--is-out-of-right-bound');

        // step 3
        activeSlide.parentElement.addEventListener('transitionend', (event: TransitionEvent) => {
            const transitionPropery: string = event.propertyName;
            const transitionSource: HTMLElement = event.srcElement as HTMLElement;

            // ignore other event types and transtion-events from within each slide
            if (transitionPropery !== 'transform' && this.slides.indexOf(transitionSource) === -1) {
                return;
            }

            newSlide.classList.add('gallery_slide--is-current');
            newSlide.classList.remove('gallery_slide--is-following');
            activeSlide.classList.remove('gallery_slide--is-current',
            'gallery_slide--is-out-of-left-bound', 'gallery_slide--is-out-of-right-bound');

            // step 4
            this.updateCounter();
        });
    }

    private updateCounter(): void {
        const currentSlideIndex: number = this.slides.findIndex((element: HTMLElement) => {
            return element.classList.contains('gallery_slide--is-current');
        });
        this.counter.innerHTML = `
            <span class="gallery_counter-current">${currentSlideIndex + 1}</span>
                <span class="gallery_counter-seperator">/</span>
            <span class="gallery_counter-total">${this.slides.length}</span>
        `;
    }
}

const gallery1 = new BaseGallery(document.querySelector('.gallery--base') as HTMLElement);
